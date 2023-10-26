const Customer = require("../models/customerSchema");

// add customer
exports.customerPost = async (req, res) => {
    // console.log(req.body);
    const { name, pBought, due, date } = req.body;
    try {
        const customer = new Customer({ name, pBought, due, date });
        await customer.save();
        res.status(201).json(customer);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'Invalid data provided', error });
    }
};


exports.customersGet = async (req, res) => {
    const search = req.query.search || ""
    const page = req.query.page || 1
    const ITEM_PER_PAGE = 4;
    const { selectedMonth, selectedYear } = req.query;


    const query = {
        name: { $regex: search, $options: "i" }
    };
    if (selectedMonth && selectedYear) {
        query.date = {
            $gte: new Date(selectedYear, selectedMonth - 1, 1),   // Start of the selected month
            $lte: new Date(selectedYear, selectedMonth - 1, 31, 23, 59, 59)  // End of the selected month
        };
    }
    try {
        const skip = (page - 1) * ITEM_PER_PAGE;
        const count = await Customer.countDocuments(query);
        const customerData = await Customer.find(query)
            .limit(ITEM_PER_PAGE)
            .skip(skip);
        const pageCount = Math.ceil(count / ITEM_PER_PAGE);

        res.status(200).json({
            Pagination: {
                count,
                pageCount
            },
            customerData
        });
    } catch (error) {
        res.status(500).json(error);
    }
};


// single customer get
exports.singlecustomerget = async (req, res) => {

    const { id } = req.params;

    try {
        const customerData = await Customer.findOne({ _id: id });
        res.status(200).json(customerData)
    } catch (error) {
        res.status(401).json(error)
    }
}

// edit customer
exports.customerEdit = async (req, res) => {
    const { id } = req.params;
    const { name, pBought, due, date } = req.body;
    try {
        const customer = await Customer.findByIdAndUpdate({ _id: id }, { name, pBought, due, date }, { new: true });
        if (!customer) {
            return res.status(404).json({ error: 'Event not found' });
        }
        await customer.save()
        res.json(customer);
    } catch (error) {
        res.status(400).json({ error: 'Invalid data provided', error });
    }

}

// delete customer
exports.customerDelete = async (req, res) => {
    const { id } = req.params;
    try {
        const deletecustomer = await Customer.findByIdAndDelete({ _id: id });
        res.status(200).json(deletecustomer);
    } catch (error) {
        res.status(401).json(error)
    }
}

