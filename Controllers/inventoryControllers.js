const Inventory = require("../models/inventorySchema");
const moment = require("moment");
const BASE_URL=process.env.BASE_URL
// add inventory
exports.inventoryPost = async (req, res) => {
    const file = req.file.filename;
    const { pName, category, stock, price,spd } = req.body;

    if (!pName || !category || !stock || !price || !file) {
        res.status(401).json("All Inputs is required")
    }

    try {



        const datecreated = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");

        const inventoryData = new Inventory({
            // pName, category, stock, price, profile: file, datecreated
            pName, category,spd, stock, price, profile: `${BASE_URL}/uploads/${file}`, datecreated
        });
        await inventoryData.save();
        res.status(200).json(inventoryData);

    } catch (error) {
        res.status(401).json(error);
        console.log("catch block error", error)
    }
};


// get inventory
exports.inventoryGet = async (req, res) => {
    const search = req.query.search || ""
    const page = req.query.page || 1
    const ITEM_PER_PAGE = 4;
    const { selectedMonth, selectedYear } = req.query;

    const query = {
        pName: { $regex: search, $options: "i" }
    }
    if (selectedMonth && selectedYear) {
        query.spd = {
            $gte: new Date(selectedYear, selectedMonth - 1, 1),   // Start of the selected month
            $lte: new Date(selectedYear, selectedMonth - 1, 31, 23, 59, 59)  // End of the selected month
        };
    }
    try {
        const skip = (page - 1) * ITEM_PER_PAGE  // 1 * 4 = 4
        const count = await Inventory.countDocuments(query);
        const inventoryData = await Inventory.find(query)
            .limit(ITEM_PER_PAGE)
            .skip(skip);
        const pageCount = Math.ceil(count / ITEM_PER_PAGE);  // 8 /4 = 2
        res.status(200).json({
            Pagination: {
                count, pageCount
            },
            inventoryData
        })
    } catch (error) {
        res.status(401).json(error)
    }
}

// single inventory get
exports.singleinventoryget = async (req, res) => {

    const { id } = req.params;

    try {
        const inventoryData = await Inventory.findOne({ _id: id });
        res.status(200).json(inventoryData)
    } catch (error) {
        res.status(401).json(error)
    }
}

// edit inventory
exports.inventoryEdit = async (req, res) => {
    const { id } = req.params;
    const { pName, category, stock,spd, price, user_profile } = req.body;
    const file = req.file ? req.file.filename : user_profile

    const dateUpdated = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");

    try {
        const updateInventory = await Inventory.findByIdAndUpdate({ _id: id }, {
            pName, category,spd, stock, price, profile: file, dateUpdated
        }, {
            new: true
        });

        await updateInventory.save();
        res.status(200).json(updateInventory);
    } catch (error) {
        res.status(401).json(error)
    }
}

// delete inventory
exports.inventoryDelete = async (req, res) => {
    const { id } = req.params;
    try {
        const deleteinventory = await Inventory.findByIdAndDelete({ _id: id });
        res.status(200).json(deleteinventory);
    } catch (error) {
        res.status(401).json(error)
    }
}

