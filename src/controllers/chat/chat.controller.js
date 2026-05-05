import catchAsync from "../../utils/catchAsync.js"
import chatService from '../../service/chat/chat.service.js'
import { StatusCodes } from "http-status-codes";
import SellerCustomer from "../../models/chat/sellerCustomer.model.js";
export const add_customer_friend = catchAsync(async (req, res) => {
  const { sellerId, userId } = req.body;
  const { myFriends, messages, currentFriend } = await chatService.add_customer_friend(sellerId, userId);
  res.status(StatusCodes.OK).json({
    myFriends,
    messages,
    currentFriend
  })
})

export const send_message_to_seller = catchAsync(async (req, res) => {
  const { sellerId, userId, text, name } = req.body;
  const message = await chatService.send_message_to_seller(sellerId, userId, text, name);
  res.status(StatusCodes.OK).json({
    message
  })
})

export const get_friends = catchAsync(async (req, res) => {
  const { userId } = req.params;


  const data = await SellerCustomer.findOne({ myId: userId });

  if (!data) {
    return res.status(200).json({
      myFriends: []
    });
  }

  return res.status(StatusCodes.OK).json({
    myFriends: data.myFriends || []
  });
});

export const get_customers = catchAsync(async (req, res) => {
  const { sellerId } = req.params
  const customers = await chatService.get_customers(sellerId)
  res.status(StatusCodes.OK).json({
    customers
  })
});

export const get_customer_messages = catchAsync(async (req, res) => {
  const { id } = req;
  const { customerId } = req.params;
  const { messages, currentCustomer } = await chatService.get_customer_messages(id, customerId)
  res.status(StatusCodes.OK).json({
    messages,
    currentCustomer
  })
});

export const send_message = catchAsync(async (req, res) => {
  const { senderId, receiverId, text, shopName } = req.body
  const message = await chatService.send_message(senderId, receiverId, text, shopName)
  res.status(StatusCodes.OK).json({
    message
  })
});