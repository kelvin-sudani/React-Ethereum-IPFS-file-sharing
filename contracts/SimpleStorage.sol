// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

// contract SimpleStorage {
// uint256 storedData;

//     // struct file {
//     //     string hash;
//     // }

//     string hash;

// function set(uint256 x) public {
//     storedData = x;
// }

// function get() public view returns (uint256) {
//     return storedData;
// }

//     // mapping(address => file[]) files;

//     // function addfile(string memory _hash) public returns (address) {
//     //     files[msg.sender].push(file({hash: _hash}));
//     // }

//     function addfile(string memory _hash) public {
//         hash = _hash;
//     }

//     // function getfile(address addr, uint256 _index)
//     //     public
//     //     view
//     //     returns (string memory)
//     // {
//     //     file memory file_instance = files[addr][_index];
//     //     return (file_instance.hash);
//     // }

//     function getfile() public view returns (string memory) {
//         return hash;
//     }

//     // function getLength() public view returns (uint256) {
//     //     return files[msg.sender].length;
//     // }
// }

contract SimpleStorage {
    uint256 storedData;

    function set(uint256 x) public {
        storedData = x;
    }

    function get() public view returns (uint256) {
        return storedData;
    }

    struct file {
        string hash;
        string key;
    }

    mapping(string => file[]) public files;

    function addfile(string memory _key, string memory _hash) public {
        bool isPartOf = false;

        for (uint256 j = 0; j < files[_key].length; j++) {
            file memory file_instance = files[_key][j];

            if (
                keccak256(abi.encodePacked(file_instance.hash)) ==
                keccak256(abi.encodePacked(_hash))
            ) {
                isPartOf = true;
            }
        }

        if (!isPartOf) {
            files[_key].push(file({hash: _hash, key: _key}));
        }
    }

    function getfile(string memory _key, uint256 _index)
        public
        view
        returns (string memory)
    {
        file memory file_instance = files[_key][_index];
        return (file_instance.hash);
    }

    function getlastfile(string memory _key)
        public
        view
        returns (string memory)
    {
        uint256 new_index = files[_key].length - 1;
        file memory file_instance = files[_key][new_index];
        return (file_instance.hash);
    }

    function getLength(string memory _key) public view returns (uint256) {
        return files[_key].length;
    }
}
