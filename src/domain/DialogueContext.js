// @flow

export default class DialogueContext {
  data(): Promise<Object> {
    return Promise.resolve({
      character: {
        player() {
          return {
            name: "foo"
          };
        }
      },
      this: {
        actor: {
          name: "bar"
        }
      }
    });
  }
}
