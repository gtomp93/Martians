const { translateMessage } = require("../helpers");

//Run this test with the "yarn test" script

//I would write some more tests here if I had time but wanted to at least
//show I am know jest and how it can be used!

test("Exercise 1.1", () => {
  expect(translateMessage("I HATE FOOD. FOOD I HATE.")).toBe(
    "L-R-Z-----KK-ZZ-----B--BB-K---Z----------B--BB-K---Z-----L-R-Z-----KK-ZZ----------"
  );
});
