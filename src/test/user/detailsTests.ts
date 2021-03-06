import "mocha";
import * as psy from "psychopiggy";
import "should";
import * as auth from "../..";
import { dbConfig, getCallContext, insertUser, user1 } from "../test";

const shouldLib = require("should");

export default function() {
  describe("status check", () => {
    it("gets user details by external_id", async () => {
      const pool = psy.getPool(dbConfig);

      // clean up
      await pool.query(`DELETE FROM user_permissions;`);
      await pool.query(`DELETE FROM scuttlespace_user;`);

      await insertUser(user1, pool);
      const result = await auth.user(
        { externalId: "jpk001" },
        getCallContext()
      );
      shouldLib.exist(result);
      (result as any).data.should.deepEqual({
        about: "hal9000 supervisor",
        domain: "jeswin.org",
        enabled: true,
        externalId: "jpk001",
        permissions: undefined,
        pub: "hackers",
        rowid: (result as any).data.rowid,
        username: "jeswin"
      });
    });

    it("gets user details by username", async () => {
      const pool = psy.getPool(dbConfig);

      // clean up
      await pool.query(`DELETE FROM user_permissions;`);
      await pool.query(`DELETE FROM scuttlespace_user;`);

      await insertUser(user1, pool);
      const result = await auth.user({ username: "jeswin" }, getCallContext());
      shouldLib.exist(result);
      (result as any).data.should.deepEqual({
        about: "hal9000 supervisor",
        domain: "jeswin.org",
        enabled: true,
        externalId: "jpk001",
        permissions: undefined,
        pub: "hackers",
        rowid: (result as any).data.rowid,
        username: "jeswin"
      });
    });

    it("gets no user details of caller if user missing", async () => {
      const pool = psy.getPool(dbConfig);

      // clean up
      await pool.query(`DELETE FROM user_permissions;`);
      await pool.query(`DELETE FROM scuttlespace_user;`);

      await insertUser(user1, pool);
      const result = await auth.user({ username: "boom1" }, getCallContext());
      shouldLib.not.exist((result as any).data);
    });
  });
}
