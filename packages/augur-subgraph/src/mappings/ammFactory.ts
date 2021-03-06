import { log } from '@graphprotocol/graph-ts'
import {
  AddAMMCall,
  AddAMMWithLiquidityCall,
} from "../../generated/AMMFactory/AMMFactory";
import {
  createAndSaveAMMExchange,
  getOrCreateParaShareToken,
} from "../utils/helpers";

export function handleAddAMMExchange(call: AddAMMCall): void {
  let id = call.outputs.value0.toHexString();
  let marketId = call.inputs._market.toHexString();
  let shareTokenId = call.inputs._para.toHexString();
  let paraShareToken = getOrCreateParaShareToken(shareTokenId);
  let fee = call.inputs._fee;

  // @todo The hardcoded cash will eventually come from the ShareToken pending ShareToken creation event.
  createAndSaveAMMExchange(id, marketId, shareTokenId, paraShareToken.cash, fee);
}

export function handleAddAMMExchangeWithLiquidity(call: AddAMMWithLiquidityCall): void {
  let id = call.outputs._ammAddress.toHexString();
  let marketId = call.inputs._market.toHexString();
  let shareTokenId = call.inputs._para.toHexString();
  let paraShareToken = getOrCreateParaShareToken(shareTokenId);
  let fee = call.inputs._fee;

  createAndSaveAMMExchange(id, marketId, shareTokenId, paraShareToken.cash, fee);
}
