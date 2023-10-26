const Employee = require("../models/employeeSchema");

// add Employee
exports.employeePost = async (req, res) => {
    // console.log(req.body);
    const { name, spd, role, exp, salary, leave } = req.body;
    try {
        const employee = new Employee({ name, spd, role, exp, salary, leave });
        await employee.save();
        res.status(201).json(employee);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'Invalid data provided', error });
    }
};

// get Employee
exports.employeesGet = async (req, res) => {
    const search = req.query.search || "";
    const page = req.query.page || 1;
    const ITEM_PER_PAGE = 4;
    const { selectedMonth, selectedYear } = req.query;

    let query = {
        name: { $regex: search, $options: "i" }
    };

    if (selectedMonth && selectedYear) {
        query.spd = {
            $gte: new Date(selectedYear, selectedMonth - 1, 1),   // Start of the selected month
            $lte: new Date(selectedYear, selectedMonth - 1, 31, 23, 59, 59)  // End of the selected month
        };
    }

    try {
        const skip = (page - 1) * ITEM_PER_PAGE;
        const count = await Employee.countDocuments(query);
        const employeeData = await Employee.find(query)
            .limit(ITEM_PER_PAGE)
            .skip(skip);
        const pageCount = Math.ceil(count / ITEM_PER_PAGE);

        res.status(200).json({
            Pagination: {
                count,
                pageCount
            },
            employeeData
        });
    } catch (error) {
        res.status(500).json(error);
    }
};


exports.singleemployeeget = async (req, res) => {

    const { id } = req.params;

    try {
        const employeeData = await Employee.findOne({ _id: id });
        res.status(200).json(employeeData)
    } catch (error) {
        res.status(401).json(error)
    }
}

// edit Employee
exports.employeeEdit = async (req, res) => {
    const { id } = req.params;
    const { name, spd, role, exp, salary, leave } = req.body;
    try {
        const employee = await Employee.findByIdAndUpdate({ _id: id }, { name, spd, role, exp, salary, leave }, { new: true });
        if (!employee) {
            return res.status(404).json({ error: 'Event not found' });
        }
        await employee.save()
        res.json(employee);
    } catch (error) {
        res.status(400).json({ error: 'Invalid data provided', error });
    }

}

// delete Employee
exports.employeeDelete = async (req, res) => {
    const { id } = req.params;
    try {
        const deleteEmployee = await Employee.findByIdAndDelete({ _id: id });
        res.status(200).json(deleteEmployee);
    } catch (error) {
        res.status(401).json(error)
    }
}

