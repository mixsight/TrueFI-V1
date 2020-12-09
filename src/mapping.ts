import { BigInt, BigDecimal } from '@graphprotocol/graph-ts'

import {
  Approval,
  Borrow,
  Collected,
  Exited,
  Flushed,
  Joined,
  JoiningFeeChanged,
  OwnershipTransferred,
  Pulled,
  Repaid,
  Transfer
} from "../generated/Contract/Contract"

import { Staker, Borrower, Allowance } from "../generated/schema"

import {
  createStaker,
  createBorrower
 } from './helpers'

export function handleApproval(event: Approval): void {
	let allow = new Allowance(event.address.toHexString())
	allow.owner = event.params.owner  //return Bytes
	allow.spender = event.params.spender  //return Bytes
	allow.value = event.params.value.toBigDecimal()
	allow.save()
}

export function handleBorrow(event: Borrow): void {
	let brwr = Borrower.load(event.params.borrower.toHexString()) as Borrower
	if ( brwr === null){
		createBorrower(event.params.borrower)
		brwr.debt = event.params.amount.toBigDecimal()
		brwr.joinedAtBlockNumber = event.block.number
	} else {
		brwr = Borrower.load(event.params.borrower.toHexString()) as Borrower
		brwr.debt = brwr.debt.plus(event.params.amount.toBigDecimal())
	}
	brwr.save()
}

export function handleCollected(event: Collected): void {
	let stkr = Staker.load(event.params.beneficiary.toHexString()) as Staker
	stkr.profit = event.params.amount.toBigDecimal()
	stkr.save()
}

export function handleExited(event: Exited): void {
	let stkr = Staker.load(event.params.staker.toHexString()) as Staker
	stkr.joinedPool = false
	stkr.stake = stkr.stake.minus(event.params.amount.toBigDecimal())
	stkr.mintedLT = stkr.mintedLT.minus(event.params.amount.toBigDecimal()) // 1:1 ratio of LoanTokens to original funds
	stkr.profit = stkr.profit.minus(stkr.profit)
	stkr.exitedAtBlockNumber = event.block.number
	stkr.save()
}

export function handleFlushed(event: Flushed): void {
	let stkr = Staker.load(event.address.toHexString()) as Staker
	stkr.curveBalance = event.params.currencyAmount.toBigDecimal()
	stkr.save()
}

export function handleJoined(event: Joined): void {
	let stkr = Staker.load(event.params.staker.toHexString()) as Staker
	if (stkr === null){
		createStaker(event.params.staker)
		stkr.stake = event.params.deposited.toBigDecimal()
		stkr.mintedLT = event.params.minted.toBigDecimal()
		stkr.joinedAtBlockNumber = event.block.number
	} else {
		stkr = Staker.load(event.params.staker.toHexString()) as Staker
		stkr.stake = stkr.stake.plus(event.params.deposited.toBigDecimal())
		stkr.mintedLT = stkr.mintedLT.plus(event.params.minted.toBigDecimal())
	}
	stkr.save()
	
}

export function handleJoiningFeeChanged(event: JoiningFeeChanged): void {
	
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
	
}

export function handlePulled(event: Pulled): void {
	let stkr = Staker.load(event.address.toHexString())
	stkr.curveBalance = stkr.curveBalance.minus(event.params.yAmount.toBigDecimal())
	stkr.save()
}

export function handleRepaid(event: Repaid): void {
	let brwr = Borrower.load(event.params.payer.toHexString())
	brwr.debt = brwr.debt.minus(event.params.amount.toBigDecimal())
	if (brwr.debt.equals(BigInt.fromI32(0).toBigDecimal())){
		brwr.repayedLoanAtBlockNumber = event.block.number
	}
	brwr.save()	
}

export function handleTransfer(event: Transfer): void {
	
}


