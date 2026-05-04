import Message from "../../models/chat/message.model.js";
import SellerCustomer from "../../models/chat/sellerCustomer.model.js";
import Customer from "../../models/customer.model.js";
import Seller from "../../models/seller.model.js";


class ChatService {
  async add_customer_friend(sellerId, userId) {
    if (!sellerId) {
      return {
        myFriends: [],
        messages: [],
        currentFriend: null
      };
    }
    const seller = await Seller.findById(sellerId);
    const user = await Customer.findById(userId);
    if (!seller || !user) {
      throw new Error("Seller hoặc User không tồn tại");
    }
    const checkSeller = await SellerCustomer.findOne({
      $and: [
        { myId: userId },
        { myFriends: { $elemMatch: { fdId: sellerId } } }
      ]
    })
    if (!checkSeller) {
      await SellerCustomer.updateOne({
        myId: userId,
      }, {
        $push: {
          myFriends: {
            fdId: sellerId,
            name: seller.shopInfo?.shopName,
            image: seller.image
          }
        }
      })
    }



    const checkCustomer = await SellerCustomer.findOne({
      $and: [
        { myId: sellerId },
        { myFriends: { $elemMatch: { fdId: userId } } }
      ]
    })

    if (!checkCustomer) {
      await SellerCustomer.updateOne({
        myId: sellerId
      }, {
        $push: {
          myFriends: {
            fdId: userId,
            name: user.name,
            image: "",
          }
        }
      })
    }

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: sellerId },
        { senderId: sellerId, receiverId: userId }
      ]
    })
    const myFriend = await SellerCustomer.findOne({
      myId: userId
    })
    const currentFriend = myFriend?.myFriends?.find(friend => friend.fdId === sellerId)
    return {
      myFriends: myFriend.myFriends,
      messages: messages,
      currentFriend
    }

  }

  async send_message_to_seller(sellerId, userId, text, name) {
    const message = await Message.create({
      senderId: userId,
      senderName: name,
      receiverId: sellerId,
      message: text
    })

    const data = await SellerCustomer.findOne({ myId: userId })
    let myFriends = data.myFriends
    let index = myFriends.findIndex(f => f.fdId === sellerId)
    while (index > 0) {
      let temp = myFriends[index]
      myFriends[index] = myFriends[index - 1]
      myFriends[index - 1] = temp
      index--
    }
    await SellerCustomer.updateOne(
      {
        myId: userId
      },
      {
        myFriends
      }

    )

    const data1 = await SellerCustomer.findOne({ myId: sellerId })
    let myFriends1 = data1.myFriends
    let index1 = myFriends1.findIndex(f => f.fdId === userId)
    while (index1 > 0) {
      let temp1 = myFriends1[index1]
      myFriends1[index1] = myFriends[index1 - 1]
      myFriends1[index1 - 1] = temp1
      index1--
    }
    await SellerCustomer.updateOne(
      {
        myId: sellerId
      },
      {
        myFriends1
      }
    )
    return message
  }
  async get_customers(sellerId) {
    const data = await SellerCustomer.findOne({ myId: sellerId })
    return data?.myFriends
  }

  async get_customer_messages(id, customerId) {
    const messages = await Message.find({
      $or: [
        { senderId: id, receiverId: customerId },
        { senderId: customerId, receiverId: id }
      ]
    })

    const currentCustomer = await Customer.findById(customerId)
    return {
      messages,
      currentCustomer
    }
  }
}
export default new ChatService();