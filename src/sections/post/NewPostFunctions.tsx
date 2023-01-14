const dataTypes = {
  EIP712Domain: [
    { name: "name", type: "string" },
    { name: "version", type: "string" },
    { name: "chainId", type: "uint256" },
    { name: "verifyingContract", type: "address" },
  ],
  ActionData: [
    { name: "actionType", type: "uint8" },
    { name: "senderTokenId", type: "uint64" },
    { name: "receiverTokenId", type: "uint64" },
    { name: "tipAmount", type: "uint256" },
    { name: "timestamp", type: "uint64" },
    { name: "sender", type: "address" },
    { name: "cawId", type: "bytes32" },
    { name: "text", type: "string" },
  ],
};

export const signData = async (user, data) => {
  const privateKey =
    web3.eth.currentProvider.wallets[user.toLowerCase()].getPrivateKey();
  return signTypedData({
    data: data,
    privateKey: privateKey,
    version: SignTypedDataVersion.V4,
  });
};

export const generateData = async (action: Action) => {
  const actionType = {
    caw: 0,
    like: 1,
    recaw: 2,
    follow: 3,
  }[action.actionType];

  const domain = {
    // chainId: 31337, wtf is this
    chainId: 5,
    name: "CawNet",
    //goerli CawActions address
    verifyingContract: "0x21121c9f9289cF38DdfF7763Bb4B0735BF78aFCD",
    version: "1",
  };

  return {
    primaryType: "ActionData",
    message: {
      actionType: actionType,
      sender: action.sender,
      senderTokenId: action.senderTokenId,
      // receiverTokenId: action.receiverTokenId || 0,
      // tipAmount: action.tipAmount || 0,
      timestamp: action.timestamp || Math.floor(new Date().getTime() / 1000),
      // cawId:
      //   action.cawId ||
      //   "0x0000000000000000000000000000000000000000000000000000000000000000",
      text: action.message || "",
    },
    domain: domain,
    types: {
      EIP712Domain: dataTypes.EIP712Domain,
      ActionData: dataTypes.ActionData,
    },
  };
};

// export const verifyAndSplitSig = async (sig, user, data) => {
//   console.log("SIG", sig);
//   // console.log('hashed SIG', web3.utils.soliditySha3(sig))

//   const signatureSans0x = sig.substring(2);
//   const r = "0x" + signatureSans0x.substring(0, 64);
//   const s = "0x" + signatureSans0x.substring(64, 128);
//   const v = parseInt(signatureSans0x.substring(128, 130), 16);
//   // console.log('v: ', v)
//   // console.log('r: ', r)
//   // console.log('s: ', s)
//   const recoverAddr = recoverTypedSignature({
//     data: data,
//     signature: sig,
//     version: SignTypedDataVersion.V4,
//   });
//   // console.log('recovered address', recoverAddr)
//   // console.log('account: ', user)
//   expect(recoverAddr).to.equal(user.toLowerCase());

//   return { r, s, v };
// };

type ParamData = {
  sender: string;
};
type Action = {
  actionType: string;
  message: string;
  timestamp: number;
  sender: string;
  senderTokenId: number;
};

export const processActions = async (
  actions: Array<Action>,
  params: ParamData
) => {
  const signedActions = await Promise.all(
    actions.map(async (action: Action) => {
      const data = await generateData(action);
      console.log("✍️ with data:", data);
      const sig = await signData(action.sender, data);
      const sigData = await verifyAndSplitSig(sig, action.sender, data);

      return {
        data: data,
        sigData: sigData,
      };
    })
  );

  // console.log(
  //   "Data",
  //   signedActions.map(function (action) {
  //     return action.data.message;
  //   })
  // );

  // t = await cawActions.processActions(
  //   params.senderTokenId || 1,
  //   {
  //     v: signedActions.map(function (action) {
  //       return action.sigData.v;
  //     }),
  //     r: signedActions.map(function (action) {
  //       return action.sigData.r;
  //     }),
  //     s: signedActions.map(function (action) {
  //       return action.sigData.s;
  //     }),
  //     actions: signedActions.map(function (action) {
  //       return action.data.message;
  //     }),
  //   },
  //   {
  //     nonce: await web3.eth.getTransactionCount(params.sender),
  //     from: params.sender,
  //   }
  // );

  // const fullTx = await web3.eth.getTransaction(t.tx);
  // console.log(
  //   "processed",
  //   signedActions.length,
  //   "actions. GAS units:",
  //   BigInt(t.receipt.gasUsed)
  // );

  // return {
  //   tx: t,
  //   signedActions: signedActions,
  // };
};
