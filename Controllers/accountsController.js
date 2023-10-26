const Account = require("../models/accountSchema");

// add Account
exports.accountPost = async (req, res) => {
    // console.log(req.body);
    const { date, type, amount, summary } = req.body;
    try {
        const account = new Account({ date, type, amount, summary });
        await account.save();
        res.status(201).json(account);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'Invalid data provided', error });
    }
};


// get Account
exports.accountsGet = async (req, res) => {
    // const { date, page, search } = req.query;

    // const ITEM_PER_PAGE = 4;

    // const firstDayOfMonth = new Date(date);
    // const lastDayOfMonth = new Date(firstDayOfMonth);
    // lastDayOfMonth.setHours(23, 59, 59, 999)

    // const query = {
    //     date: {
    //         $gte: firstDayOfMonth,
    //         $lt: lastDayOfMonth
    //     },
    //     type: { $regex: search, $options: "i" }
    // };
    // console.log("MongoDB Query:", query, date);



    const search = req.query.search || "";
    const page = req.query.page || 1;
    const ITEM_PER_PAGE = 4;
    const { selectedMonth, selectedYear } = req.query;

    let query = {
        type: { $regex: search, $options: "i" }
    };

    if (selectedMonth && selectedYear) {
        query.date = {
            $gte: new Date(selectedYear, selectedMonth - 1, 1),   // Start of the selected month
            $lte: new Date(selectedYear, selectedMonth - 1, 31, 23, 59, 59)  // End of the selected month
        };
    }








    try {
        const skip = (page - 1) * ITEM_PER_PAGE;
        const count = await Account.countDocuments(query);
        const accountData = await Account.find(query)
            .limit(ITEM_PER_PAGE)
            .skip(skip);
        const pageCount = Math.ceil(count / ITEM_PER_PAGE);

        res.status(200).json({
            Pagination: {
                count,
                pageCount
            },
            accountData
        });
    } catch (error) {
        res.status(500).json(error);
    }
};


// single Account get
exports.singleAccountget = async (req, res) => {

    const { id } = req.params;

    try {
        const accountData = await Account.findOne({ _id: id });
        res.status(200).json(accountData)
    } catch (error) {
        res.status(401).json(error)
    }
}

// edit Account
exports.accountEdit = async (req, res) => {
    const { id } = req.params;
    const { date, type, amount, summary } = req.body;
    try {
        const account = await Account.findByIdAndUpdate({ _id: id }, { date, type, amount, summary }, { new: true });
        if (!account) {
            return res.status(404).json({ error: 'Event not found' });
        }
        await account.save()
        res.json(account);
    } catch (error) {
        res.status(400).json({ error: 'Invalid data provided', error });
    }

}

// delete Account
exports.accountDelete = async (req, res) => {
    const { id } = req.params;
    try {
        const deleteAccount = await Account.findByIdAndDelete({ _id: id });
        res.status(200).json(deleteAccount);
    } catch (error) {
        res.status(401).json(error)
    }
}

