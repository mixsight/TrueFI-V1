import { BigInt, BigDecimal, Address } from "@graphprotocol/graph-ts"
import { Staker, Borrower, Allowance } from "../generated/schema"

export let ZERO_BI = BigInt.fromI32(0)
export let ZERO_BD = BigDecimal.fromString('0')


export function createStaker(address: Address): void {
	let stkr = Staker.load(address.toHexString())
	if (stkr === null) {
		stkr = new Staker(address.toHexString())
		let appr = Allowance.load(address.toHexString())
		stkr.approvals = [appr.id, appr.owner.toHexString(), appr.spender.toHexString(), appr.value.toString()] 
		stkr.joinedPool = true 
		stkr.stake = ZERO_BD
		stkr.mintedLT = ZERO_BD
		stkr.profit = ZERO_BD
		stkr.curveBalance = ZERO_BD
		stkr.joinedAtBlockNumber = ZERO_BI
		stkr.exitedAtBlockNumber = ZERO_BI
		stkr.save()
	}
}

export function createBorrower(address: Address): void {
	let brwr = Borrower.load(address.toHexString())
	if(brwr === null){
		brwr = new Borrower(address.toHexString())
		brwr.debt = ZERO_BD
		brwr.joinedAtBlockNumber = ZERO_BI
		brwr.repayedLoanAtBlockNumber = ZERO_BI
		brwr.save()	
	}
}
