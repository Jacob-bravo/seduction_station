const { ObjectId } = require("mongodb");
class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }


  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    // console.log(keyword);
    this.query = this.query.find({ ...keyword });
    return this;
  }


  searchModel() {
    const keyword = this.queryStr.keyword
      ? {
          $or: [
            {
              username: {
                $regex: this.queryStr.keyword,
                $options: "i",
              },
            },
            {
              about: {
                $regex: this.queryStr.keyword,
                $options: "i",
              },
            },
          ],
        }
      : {};

    // console.log(keyword);
    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const querycopy = { ...this.queryStr };
    //removing fields from the query
    // console.log(querycopy);
    const removeFields = ["keyword", "limit", "page", "sort"];
    removeFields.forEach((el) => delete querycopy[el]);
    // console.log(querycopy);
    // advanced filter for price,ratings etc
    // Sort by price if sort parameter is provided
    let queryStr = JSON.stringify(querycopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort === "lowest" ? 1 : -1;
      querycopy["price"] = { $exists: true };
      this.query = this.query.sort({ price: sortBy });
    }
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  pagination(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
  }
}

module.exports = APIFeatures;