import React, { useEffect, useRef, useState } from "react";
import { Map, Marker, TileLayer, Tooltip as TooltipMap } from "react-leaflet";
import L from "leaflet";
import * as ELG from "esri-leaflet-geocoder";
import { Row, Col } from "reactstrap";
import Input from "../../components/Common/Input";
import SelectOption from "../../components/Common/SelectOption";
import Button from "../../components/Common/Button";

const ShippingAddress = (props) => {
  const {
    user,
    updateAddress,
    locators,
    formErrors,
    addressChange,
    shippingAddressChange,
    selectAddress,
    placeOrder,
  } = props;
  const { name, phone, email, _id, address } = user;
  const defaultAddress = address?.find((a) => a.isDefault === true);
  const mapCheckoutRef = useRef();
  const apiKey = process.env.REACT_APP_GEOCODER_API_KEY;
  // "AAPKb10821df102a46a4b930958d7a6a06593sdla7i0cMWoosp7XXlYflDTAxsZMUq-oKvVOaom9B8CokPvJFd-sE88vOQ2B_rC";
  const [addressMap, setAddressMap] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const addressSelect = [];
  address?.map((addr) => {
    let a = { value: addr._id, label: addr.address };
    addressSelect.push(a);
  });
  console.log(addressSelect);

  useEffect(() => {
    const map = mapCheckoutRef?.current?.leafletElement;

    console.log(mapCheckoutRef);
    const searchControl = new ELG.geosearch({
      useMapBounds: false,
      position: "topleft",
      placeholder: "Tìm địa chỉ",
      providers: [
        ELG.arcgisOnlineProvider({
          apikey: apiKey,
          nearby: {
            lat: -33.8688,
            lng: 151.2093,
          },
        }),
      ],
    }).addTo(map);

    const results = new L.LayerGroup().addTo(map);
    results.addLayer(
      L.marker({ lat: address?.lat || 33.8688, lng: address?.lng || 151.2093 })
    );
    searchControl.on("results", function (data) {
      results.clearLayers();
      for (let i = data.results.length - 1; i >= 0; i--) {
        results.addLayer(L.marker(data.results[i].latlng));
      }
    });
    map.on("click", function (e) {
      ELG.reverseGeocode({
        apikey: apiKey,
      })
        .latlng(e.latlng)

        .run(function (error, result) {
          if (error) {
            return;
          }

          results.clearLayers();

          let marker = L.marker(result.latlng).addTo(results);

          const lngLatString = `${
            Math.round(result.latlng.lng * 100000) / 100000
          }, ${Math.round(result.latlng.lat * 100000) / 100000}`;

          marker.bindPopup(
            `<b>${lngLatString}</b><p>${result.address.Match_addr}</p>`
          );
          setCity(result.address.City);
          setCountry(result.address.CntryName);
          setAddressMap(
            `${result.address.Address} ${result.address.Neighborhood}`
          );

          setState(result.address.District);
          setZipcode(result.address.Postal);
          setLat(Math.round(result.latlng.lat * 100000) / 100000);
          setLng(Math.round(result.latlng.lng * 100000) / 100000);
          addressChange(
            "lat",
            Math.round(result.latlng.lat * 100000) / 100000 || 0
          );
          addressChange(
            "lng",
            Math.round(result.latlng.lng * 100000) / 100000 || 0
          );
          addressChange("city", result.address.City || "");
          addressChange("country", result.address.CntryName || "");
          addressChange(
            "address",
            `${result.address.Address} ${result.address.Neighborhood}` || ""
          );
          addressChange("state", result.address.District || "");
          addressChange("zipCode", result.address.Postal || "");
          marker.openPopup();
        });
    });
  }, []);
  const handleSubmit = (event) => {
    event.preventDefault();
    updateAddress();
  };

  const mapComponent = (
    <Row map style={{ height: 300, with: 600 }}>
      <Map
        style={{ height: "100%", width: "100%" }}
        zoom={13}
        center={[
          address?.lat || locators[0]?.lat || 33.8688,
          address?.lng || locators[0]?.lng || 151.2093,
        ]}
        zoomControl={false}
        // onClick={handleSelectPosition}
        ref={mapCheckoutRef}
      >
        <TileLayer
          attribution=""
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locators?.map((locator, index) => {
          return (
            <Marker
              position={[locator.lat, locator.lng]}
              icon={L.icon({
                iconUrl:
                  "https://res.cloudinary.com/hoaduonghx/image/upload/v1669541451/image/wsf2f8vtuxfdcuzpmxpg.png",
                iconSize: [40, 40],
                iconAnchor: [40, 40],
                popupAnchor: [1, -34],
                shadowSize: [41, 41],
              })}
            >
              <TooltipMap offset={[12.5, -22.5]}>
                <b>{locator.address}</b>
              </TooltipMap>
            </Marker>
          );
        })}
      </Map>
    </Row>
  );
  const formAddress = address?.length ? (
    <div className="edit-address">
      <form onSubmit={handleSubmit} noValidate>
        {mapComponent}
        <SelectOption
          value={defaultAddress?._id || ""}
          options={addressSelect}
          handleSelectChange={(value) => {
            selectAddress("id", value);
          }}
          label={"Chọn địa chỉ của bạn"}
        ></SelectOption>
        <Row>
          <Col xs="12" md="6">
            <Input
              type={"text"}
              // error={formErrors["address"]}
              label={"Người nhận"}
              name={"name"}
              placeholder={"Người nhận"}
              value={name || ""}
              onInputChange={(name, value) => {
                shippingAddressChange(name, value);
              }}
            />
          </Col>
          <Col xs="12" md="6">
            <Input
              type={"text"}
              // error={formErrors["address"]}
              label={"Số điện thoại"}
              name={"phone"}
              placeholder={"Số điện thoại"}
              value={phone || ""}
              onInputChange={(name, value) => {
                addressChange(name, value);
              }}
            />
          </Col>
          <Col xs="12" md="6">
            <Input
              type={"text"}
              // error={formErrors["address"]}
              label={"Địa chỉ"}
              name={"address"}
              placeholder={"Số nhà, Phố Phường"}
              value={addressMap ? addressMap : address?.address || ""}
              onInputChange={(name, value) => {
                addressChange(name, value);
              }}
            />
          </Col>
          <Col xs="12" lg="6">
            <Input
              type={"text"}
              // error={formErrors["state"]}
              label={"Quận/Huyện"}
              name={"state"}
              placeholder={"Quận Hai Bà Trưng"}
              value={state ? state : address.state}
              onInputChange={(name, value) => {
                addressChange(name, value);
              }}
            />
          </Col>
          <Col xs="12" md="6">
            <Input
              type={"text"}
              // error={formErrors["city"]}
              label={"Thành phố"}
              name={"city"}
              placeholder={"Hà Nội"}
              value={city ? city : address.city}
              onInputChange={(name, value) => {
                addressChange(name, value);
              }}
            />
          </Col>

          <Col xs="12" lg="6">
            <Input
              type={"text"}
              // error={formErrors["country"]}
              label={"Quốc gia"}
              name={"country"}
              placeholder={"Việt Nam"}
              value={country ? country : address.country}
              onInputChange={(name, value) => {
                addressChange(name, value);
              }}
            />
          </Col>
          <Col xs="12" lg="6">
            <Input
              type={"text"}
              // error={formErrors["zipCode"]}
              label={"Mã bưu điện"}
              name={"zipCode"}
              placeholder={"VD: 10000"}
              value={zipcode ? zipcode : address.zipCode}
              onInputChange={(name, value) => {
                addressChange(name, value);
              }}
            />
          </Col>
          <Col xs="12" md="4" style={{ display: "none" }}>
            <Input
              type={"text"}
              label={"Lat"}
              // error={formErrors["lat"]}
              name={"lat"}
              value={lat ? lat : address.lat}
              onInputChange={(name, value) => {
                addressChange(name, value);
              }}
            />
          </Col>
          <Col xs="12" md="4" style={{ display: "none" }}>
            <Input
              type={"text"}
              // error={formErrors["lng"]}
              label={"Lng"}
              name={"lng"}
              value={lng ? lng : address.lng}
              onInputChange={(name, value) => {
                addressChange(name, value);
              }}
            />
          </Col>
        </Row>
        <hr />
        <div className="d-flex flex-column flex-md-row">
          <Button
            onClick={() => placeOrder()}
            text="Lưu"
            variant="danger"
            className="mb-3 mb-md-0 mr-0 mr-md-3"
          />
        </div>
      </form>
    </div>
  ) : (
    <div className="edit-address">
      <form onSubmit={handleSubmit} noValidate>
        {mapComponent}
        <SelectOption
          value={defaultAddress?._id || ""}
          options={addressSelect}
          handleSelectChange={(value) => {
            selectAddress("id", value);
          }}
          label={"Chọn địa chỉ của bạn"}
        ></SelectOption>
        <Row>
          <Col xs="12" md="6">
            <Input
              type={"text"}
              // error={formErrors["address"]}
              label={"Người nhận"}
              name={"name"}
              placeholder={"Người nhận"}
              value={name}
              onInputChange={(name, value) => {
                shippingAddressChange(name, value);
              }}
            />
          </Col>
          <Col xs="12" md="6">
            <Input
              type={"text"}
              // error={formErrors["address"]}
              label={"Số điện thoại"}
              name={"phone"}
              placeholder={"Số điện thoại"}
              value={phone}
              onInputChange={(name, value) => {
                addressChange(name, value);
              }}
            />
          </Col>
          <Col xs="12" md="6">
            <Input
              type={"text"}
              // error={formErrors["address"]}
              label={"Địa chỉ"}
              name={"address"}
              placeholder={"Số nhà, Phố Phường"}
              value={address || ""}
              onInputChange={(name, value) => {
                addressChange(name, value);
              }}
            />
          </Col>
          <Col xs="12" lg="6">
            <Input
              type={"text"}
              // error={formErrors["state"]}
              label={"Quận/Huyện"}
              name={"state"}
              placeholder={"Quận Hai Bà Trưng"}
              value={state || ""}
              onInputChange={(name, value) => {
                addressChange(name, value);
              }}
            />
          </Col>
          <Col xs="12" md="6">
            <Input
              type={"text"}
              // error={formErrors["city"]}
              label={"Thành phố"}
              name={"city"}
              placeholder={"Hà Nội"}
              value={city}
              onInputChange={(name, value) => {
                addressChange(name, value);
              }}
            />
          </Col>

          <Col xs="12" lg="6">
            <Input
              type={"text"}
              // error={formErrors["country"]}
              label={"Quốc gia"}
              name={"country"}
              placeholder={"Việt Nam"}
              value={country}
              onInputChange={(name, value) => {
                addressChange(name, value);
              }}
            />
          </Col>
          <Col xs="12" lg="6">
            <Input
              type={"text"}
              // error={formErrors["zipCode"]}
              label={"Mã bưu điện"}
              name={"zipCode"}
              placeholder={"VD: 10000"}
              value={zipcode}
              onInputChange={(name, value) => {
                addressChange(name, value);
              }}
            />
          </Col>
          <Col xs="12" md="4" style={{ display: "none" }}>
            <Input
              type={"text"}
              label={"Lat"}
              // error={formErrors["lat"]}
              name={"lat"}
              value={lat}
              onInputChange={(name, value) => {
                addressChange(name, value);
              }}
            />
          </Col>
          <Col xs="12" md="4" style={{ display: "none" }}>
            <Input
              type={"text"}
              // error={formErrors["lng"]}
              label={"Lng"}
              name={"lng"}
              value={lng}
              onInputChange={(name, value) => {
                addressChange(name, value);
              }}
            />
          </Col>
        </Row>
        <hr />
        <div className="d-flex flex-column flex-md-row">
          <Button
            onClick={() => placeOrder()}
            text="Lưu"
            variant="danger"
            className="mb-3 mb-md-0 mr-0 mr-md-3"
          />
        </div>
      </form>
    </div>
  );

  return (
    <div>
      {/* <SelectOption
        value={defaultAddress?._id || ''}
        options={addressSelect}
        handleSelectChange={(value) => {
          selectAddress("id", value);
        }}
      ></SelectOption> */}
      {formAddress}
    </div>
  );
};;

export default ShippingAddress;
