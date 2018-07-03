import pg = require("pg");
import * as psy from "psychopiggy";
import { IAPICallContext, APIResult, IAPIData } from "./types";

export interface ICreateAccountArgs {
  about: string;
  domain: string;
  enabled: boolean;
  networkId: string;
  username: string;
}

export default async function createAccount(
  accountInfo: ICreateAccountArgs,
  pool: pg.Pool,
  context: IAPICallContext
): Promise<IAPIData<string>> {
  const params = new psy.Params({
    about: accountInfo.about,
    domain: accountInfo.domain,
    enabled: accountInfo.enabled,
    network_id: accountInfo.networkId,
    username: accountInfo.username
  });
  await pool.query(
    `
    INSERT INTO account (${params.columns()})
    VALUES(${params.ids()})`,
    params.values()
  );

  return {
    data: `Created account ${accountInfo.username} for ${
      accountInfo.networkId
    }.`,
    type: "data"
  };
}
