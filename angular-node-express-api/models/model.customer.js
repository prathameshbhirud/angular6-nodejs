class CustomerModel{
    constructor(uid, fname, lname, email, zip, password){
        this.uid = uid;
        this.fname = fname;
        this.lname = lname;
        this.email = email;
        this.zip = zip;
        this.password = password;
    }
}

module.exports = CustomerModel;