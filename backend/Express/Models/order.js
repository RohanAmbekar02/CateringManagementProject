// const mongoose = require("mongoose");

// const orderSchema = new mongoose.Schema(
//   {
//     customer: {
//       customerId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Customer",
//         required: true
//       },
//       name: {
//         type: String,
//         required: true
//       }
//     },

//     orderDate: {
//       type: Date,
//       required: true
//     },

//     items: [
//       {
//         itemId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Item",
//           required: true
//         },
//         name: String,
//         price: Number,
//         qty: Number,
//         total: Number
//       }
//     ],

//     subtotal: Number,
//     paidAmount: Number,
//     unpaidAmount: Number,
//     status: {
//       type: String,
//       enum: ["pending", "paid"],
//       default: "pending"
//     }
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Order", orderSchema);
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customer: {
      customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true
      },
      name: {
        type: String,
        required: true
      },
      contact: {   // ✅ ADD THIS
        type: String,
        required: true
      }
    },

    orderDate: {
      type: Date,
      required: true
    },

    items: [
      {
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Item",
          required: true
        },
        name: String,
        price: Number,
        qty: Number,
        total: Number
      }
    ],

    subtotal: Number,
    paidAmount: Number,
    unpaidAmount: Number,
    status: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
