// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {Test} from "forge-std/Test.sol";
import {ERCASSIGN} from "../src/ERCASSIGN.sol";

contract ERCASSIGNTest is Test {
    ERCASSIGN token;
    address owner;
    address user1;
    address user2;

    function setUp() public {

       owner = makeAddr("owner");
       user1 = makeAddr("user1");
       user2 = makeAddr("user2");

       vm.warp( 1 days);
       
       vm.startPrank(owner);
        token = new ERCASSIGN();
       vm.stopPrank();
    }

    function test_RequestToken_FirstClaim() public {
        vm.startPrank(user1);

        token.requestToken();

        assertEq(token.balanceOf(user1), token.CLAIM_AMOUNT());

        vm.stopPrank();
    }

    function test_CannontRequest_till24hrs() public {
        vm.startPrank(user1);
        
        token.requestToken();

        vm.expectRevert("Wait for cool-down");
        token.requestToken();
    }

    function test_UserCanClaim_after24hrs() public {
        vm.startPrank(user1);

        token.requestToken();

        vm.warp(block.timestamp + token.COOL_DOWN());

        token.requestToken();

        assertEq(token.balanceOf(user1), (token.CLAIM_AMOUNT() * 2));
    }

    function test_Ownercanmint() public {
        vm.startPrank(owner);

        uint256 amount = 10e18;

        token.mint(user2, amount);

        assertEq(token.balanceOf(user2), amount);
    }

    function test_onlyOwnercanMint() public {
        vm.startPrank(user1);

        uint256 amount = 10e18;

        vm.expectRevert();

        token.mint(user2, amount);
    }
}

