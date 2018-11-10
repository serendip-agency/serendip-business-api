export const common = {
  eq: async (input1, input2) => {
    return input1 == input2;
  },

  neq: async (input1, input2) => {
    return input1 != input2;
  },

  gt: async (input1, input2) => {
    return input1 < input2;
  },

  gte: async (input1, input2) => {
    return input1 <= input2;
  },

  lt: async (input1, input2) => {
    return input1 > input2;
  },

  lte: async (input1, input2) => {
    return input1 >= input2;
  },

  nin: async (input1, input2) => {
    if (!input1.indexOf) return false;
    return input1.indexOf(input2) == -1;
  },

  in: async (input1, input2) => {
    if (!input1.indexOf) return false;
    return input1.indexOf(input2) != -1;
  }
};
