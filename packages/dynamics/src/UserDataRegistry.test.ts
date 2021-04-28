import { UserDataRegistry } from "./UserDataRegistry";

test("user data is set", function () {
  const userDataRegistry = UserDataRegistry();

  const handle = userDataRegistry.createHandleById("test");

  handle.data.set("foo", "bar");

  expect(handle.userIndex).toBe(1);

  expect(userDataRegistry.hasIdByUserIndex(1)).toBe(true);
  expect(userDataRegistry.getIdByUserIndex(1)).toBe("test");

  expect(userDataRegistry.getHandleById("test")).toBe(handle);
  expect(userDataRegistry.getHandleByUserIndex(1)).toBe(handle);

  expect(userDataRegistry.getHandleById("test").data.get("foo")).toBe("bar");

  userDataRegistry.disposeHandleById("test");
});
