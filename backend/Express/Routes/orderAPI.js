const express = require("express");
const router = express.Router();
const Order = require("../Models/order");
const Item = require("../Models/item");

/* ➕ CREATE ORDER */
// router.post("/", async (req, res) => {
//   try {
//     const { customer, items, orderDate, paidAmount } = req.body;

//     let subtotal = 0;

//     // 🔁 Ensure item price is correct (security)
//     const populatedItems = await Promise.all(
//       items.map(async (i) => {
//         const itemFromDB = await Item.findById(i.itemId);

//         const total = itemFromDB.price * i.qty;
//         subtotal += total;

//         return {
//           itemId: itemFromDB._id,
//           name: itemFromDB.name,
//           price: itemFromDB.price,
//           qty: i.qty,
//           total
//         };
//       })
//     );

//     const unpaidAmount = subtotal - paidAmount;

//     const order = new Order({
//       customer,
//       orderDate,
//       items: populatedItems,
//       subtotal,
//       paidAmount,
//       unpaidAmount
//     });

//     await order.save();
//     res.status(201).json(order);

//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });


const Customer = require("../Models/customer");

router.post("/", async (req, res) => {
  try {
    const { customer, items, orderDate, paidAmount } = req.body;

    // 🔥 Get full customer from DB using customerId
    const customerFromDB = await Customer.findById(customer.customerId);

    if (!customerFromDB) {
      return res.status(404).json({ message: "Customer not found" });
    }

    let subtotal = 0;

    // verify each item exists to avoid null reference
    const populatedItems = await Promise.all(
      items.map(async (i) => {
        const itemFromDB = await Item.findById(i.itemId);
        if (!itemFromDB) {
          throw new Error(`Item not found during order creation: ${i.itemId}`);
        }

        const total = itemFromDB.price * i.qty;
        subtotal += total;

        return {
          itemId: itemFromDB._id,
          name: itemFromDB.name,
          price: itemFromDB.price,
          qty: i.qty,
          total
        };
      })
    );

    const unpaidAmount = subtotal - paidAmount;
    // determine status automatically
    const status = unpaidAmount <= 0 ? "paid" : "pending";

    const order = new Order({
      customer: {
        customerId: customerFromDB._id,
        name: customerFromDB.name,
        contact: customerFromDB.contact  // ✅ AUTO FROM DB
      },
      orderDate,
      items: populatedItems,
      subtotal,
      paidAmount,
      unpaidAmount,
      status
    });

    await order.save();
    res.status(201).json(order);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



/* 📄 GET ALL ORDERS */
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* 📄 GET ORDER BY ID */
router.get("/:id", async (req, res) => {
  const order = await Order.findById(req.params.id);
  res.json(order);
});
/* ✏️ UPDATE ORDER */
// router.put("/:id", async (req, res) => {
//   try {
//     const { customer, items, orderDate, paidAmount } = req.body;

//     let subtotal = 0;

//     // 🔁 Recalculate items & price from DB (secure)
//     const populatedItems = await Promise.all(
//       items.map(async (i) => {
//         const itemFromDB = await Item.findById(i.itemId);

//         const total = itemFromDB.price * i.qty;
//         subtotal += total;

//         return {
//           itemId: itemFromDB._id,
//           name: itemFromDB.name,
//           price: itemFromDB.price,
//           qty: i.qty,
//           total
//         };
//       })
//     );

//     const unpaidAmount = subtotal - paidAmount;

//     const updatedOrder = await Order.findByIdAndUpdate(
//       req.params.id,
//       {
//         customer,
//         orderDate,
//         items: populatedItems,
//         subtotal,
//         paidAmount,
//         unpaidAmount
//       },
//       { new: true }
//     );

//     if (!updatedOrder) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     res.json(updatedOrder);

//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });
router.put("/:id", async (req, res) => {
  try {
    const { customer, items, orderDate, paidAmount } = req.body;

    const customerFromDB = await Customer.findById(customer.customerId);

    if (!customerFromDB) {
      return res.status(404).json({ message: "Customer not found" });
    }

    let subtotal = 0;

    const populatedItems = await Promise.all(
      items.map(async (i) => {
        const itemFromDB = await Item.findById(i.itemId);
        if (!itemFromDB) {
          throw new Error(`Item not found during order update: ${i.itemId}`);
        }

        const total = itemFromDB.price * i.qty;
        subtotal += total;

        return {
          itemId: itemFromDB._id,
          name: itemFromDB.name,
          price: itemFromDB.price,
          qty: i.qty,
          total
        };
      })
    );

    const unpaidAmount = subtotal - paidAmount;
    // compute status based on unpaid amount (front may not send it)
    const status = unpaidAmount <= 0 ? "paid" : "pending";

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        customer: {
          customerId: customerFromDB._id,
          name: customerFromDB.name,
          contact: customerFromDB.contact  // ✅ AUTO FROM DB
        },
        orderDate,
        items: populatedItems,
        subtotal,
        paidAmount,
        unpaidAmount,
        status
      },
      { new: true }
    );

    res.json(updatedOrder);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


/* ❌ DELETE ORDER */
router.delete("/:id", async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.json({ message: "Order deleted" });
});

module.exports = router;
