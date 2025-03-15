// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract Splitwise {

    mapping(address => mapping(address => uint32)) public debts;

    function lookup(address debtor, address creditor) public view returns (uint32 ret){
        return debts[debtor][creditor];
    }

    function add_IOU(address creditor, uint32 amount, address[] memory path) public {
        require(amount > 0, "Amount must be positive!");
        require(msg.sender != creditor, "Can not owe yourself!");

        debts[msg.sender][creditor] += amount;

        // if reverse path exists, that means there is a loop of debt
        if (path.length > 0) {
            // Find min debt in the path
            uint32 minDebt = amount;
            for (uint256 i = 0; i < path.length - 1; i++) {
                uint32 currentDebt = debts[path[i]][path[i + 1]];
                if (currentDebt < minDebt) {
                    minDebt = currentDebt;
                }
            }
            // minus minDebt for all debts in path
            for (uint256 i = 0; i < path.length - 1; i++) {
                debts[path[i]][path[i + 1]] -= minDebt;
            }
            debts[msg.sender][creditor] -= minDebt;
        }
    }
}
