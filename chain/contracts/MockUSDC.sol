// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @dev Stands in for Arc USDC in tests: 6 decimals, Circle-style blocklist,
///      and a switch to return false instead of reverting, which is the other
///      way a token can fail a transfer.
contract MockUSDC {
    string public name = "USD Coin";
    string public symbol = "USDC";
    uint8 public decimals = 6;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    mapping(address => bool) public blocked;
    bool public returnFalse;

    function mint(address to, uint256 amount) external {
        balanceOf[to] += amount;
        totalSupply += amount;
    }

    function setBlocked(address account, bool value) external { blocked[account] = value; }
    function setReturnFalse(bool value) external { returnFalse = value; }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        return true;
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        return _move(msg.sender, to, amount);
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        uint256 allowed = allowance[from][msg.sender];
        require(allowed >= amount, "allowance");
        if (allowed != type(uint256).max) allowance[from][msg.sender] = allowed - amount;
        return _move(from, to, amount);
    }

    function _move(address from, address to, uint256 amount) private returns (bool) {
        require(!blocked[from] && !blocked[to], "Blocklisted");
        require(balanceOf[from] >= amount, "balance");
        if (returnFalse) return false;
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        return true;
    }
}
