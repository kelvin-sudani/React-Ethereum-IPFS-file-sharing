// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

contract SimpleStorage {
    uint256 storedData;
    string file;

    function setVal(uint256 x) public {
        storedData = x;
    }

    function get() public view returns (uint256) {
        return storedData;
    }

    function setfile(string memory f) public returns (string memory) {
        file = f;
        return f;
    }

    function getfile() public view returns (string memory) {
        return file;
    }
}
