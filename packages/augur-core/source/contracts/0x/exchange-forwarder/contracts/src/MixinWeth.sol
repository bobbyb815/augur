/*

  Copyright 2019 ZeroEx Intl.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.

*/

pragma solidity 0.5.15;

import "ROOT/0x/utils/contracts/src/LibRichErrors.sol";
import "ROOT/0x/utils/contracts/src/LibSafeMath.sol";
import "ROOT/0x/utils/contracts/src/LibMath.sol";
import "./libs/LibConstants.sol";
import "./libs/LibForwarderRichErrors.sol";


contract MixinWeth is
    LibConstants
{
    using LibSafeMath for uint256;

    /// @dev Default payable function, this allows us to withdraw WETH
    function ()
        external
        payable
    {
        if (msg.sender != address(ETHER_TOKEN)) {
            revert();
            /*
            LibRichErrors.rrevert(LibForwarderRichErrors.DefaultFunctionWethContractOnlyError(
                msg.sender
            ));
            */
        }
    }

    /// @dev Converts message call's ETH value into WETH.
    function _convertEthToWeth()
        internal
    {
        if (msg.value == 0) {
            revert();
            //LibRichErrors.rrevert(LibForwarderRichErrors.MsgValueCannotEqualZeroError());
        }
        ETHER_TOKEN.deposit.value(msg.value)();
    }

    /// @dev Transfers feePercentage of WETH spent on primary orders to feeRecipient.
    ///      Refunds any excess ETH to msg.sender.
    /// @param wethSpent Amount of WETH spent when filling orders.
    /// @param feePercentage Percentage of WETH sold that will payed as fee to forwarding contract feeRecipient.
    /// @param feeRecipient Address that will receive ETH when orders are filled.
    /// @return ethFee Amount paid to feeRecipient as a percentage fee on the total WETH sold.
    function _transferEthFeeAndRefund(
        uint256 wethSpent,
        uint256 feePercentage,
        address payable feeRecipient
    )
        internal
        returns (uint256 ethFee)
    {
        // Ensure feePercentage is less than 5%.
        if (feePercentage > MAX_FEE_PERCENTAGE) {
            revert();
            /*
            LibRichErrors.rrevert(LibForwarderRichErrors.FeePercentageTooLargeError(
                feePercentage
            ));
            */
        }

        // Ensure that no extra WETH owned by this contract has been spent.
        if (wethSpent > msg.value) {
            revert();
            /*
            LibRichErrors.rrevert(LibForwarderRichErrors.OverspentWethError(
                wethSpent,
                msg.value
            ));
            */
        }

        // Calculate amount of WETH that hasn't been spent.
        uint256 wethRemaining = msg.value.safeSub(wethSpent);

        // Calculate ETH fee to pay to feeRecipient.
        ethFee = LibMath.getPartialAmountFloor(
            feePercentage,
            PERCENTAGE_DENOMINATOR,
            wethSpent
        );

        // Ensure fee is less than amount of WETH remaining.
        if (ethFee > wethRemaining) {
            revert();
        }

        // Do nothing if no WETH remaining
        if (wethRemaining > 0) {
            // Convert remaining WETH to ETH
            ETHER_TOKEN.withdraw(wethRemaining);

            // Pay ETH to feeRecipient
            if (ethFee > 0) {
                feeRecipient.transfer(ethFee);
            }

            // Refund remaining ETH to msg.sender.
            uint256 ethRefund = wethRemaining.safeSub(ethFee);
            if (ethRefund > 0) {
                msg.sender.transfer(ethRefund);
            }
        }
    }
}
