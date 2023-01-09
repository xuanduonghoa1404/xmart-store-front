/**
 *
 * FlashSaleItem
 *
 */

import React, { useCallback, useState } from "react";
import Countdown from "react-countdown";
import { useHistory } from "react-router-dom";

const FlashSaleItem = (props) => {
  const { product, completedCountDown } = props;
  const history = useHistory();
  const updated = useCallback(() => {
    history.go(0);
  }, []);

  const pad = (n, width, z) => {
    z = z || "0";
    n = n + "";
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  };

  const dealDateTo =
    product && product.date_to ? new Date(product.date_to).getTime() : null;

  const timeCountDown = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      updated();
      return <span>KM kết thúc</span>;
    }
    if (hours > 0) {
      return (
        <span>
          {pad(hours, 2)}:{pad(minutes, 2)}:{pad(seconds, 2)}
        </span>
      );
    } else {
      return (
        <div class="red-color">
          <span>
            {pad(hours, 2)}: {pad(minutes, 2)}: {pad(seconds, 2)}
          </span>
        </div>
      );
    }
  };
  return dealDateTo !== null ? (
    <span className="flash-sale">
      <Countdown
        renderer={timeCountDown}
        date={dealDateTo}
        // date={Date.now() + 15000}
      />
    </span>
  ) : (
    <></>
  );
};

export default FlashSaleItem;
