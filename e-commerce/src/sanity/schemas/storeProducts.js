// export const featuredProducts = {

// }

export const storeProducts = {
    name: "storeProducts",
    title: "Store Products",
    type: "document",
    fields: [
      {
        name: "title",
        title: "Image Title",
        type: "string",
        validation: (Rule) => Rule.required().error("Image title is required"),
      },
      {
        name: "category",
        title: "Category",
        type: "string",
        options: {
          list: [
            { title: "Superhero", value: "superhero" },
            { title: "Science-Fiction", value: "science-fiction" },
            { title: "Fantasy", value: "fantasy" },
            { title: "Horror", value: "horror" },
            { title: "Mystery/Crime", value: "mystery/crime" },
          ],
          layout: "radio", // You can also use 'dropdown' for a dropdown list
        },
        validation: (Rule) => Rule.required().error("Category is required"),
      },
      {
        name: "slug",
        title: "Slug",
        type: "slug",
        options: {
          source: "title",
        },
        validation: (Rule) => Rule.required().error("Slug is required"),
      },
      {
        name: 'author',
        title: 'Author',
        type: 'string',
        validation: Rule => Rule.required().error('Author name is required'),
      },
      {
        name: 'artist',
        title: 'Artist',
        type: 'string',
        validation: Rule => Rule.required().error('Artist name is required'),
      },
      {
        name: "image",
        title: "Image",
        type: "image",
        options: {
          hotspot: true,
        },
        validation: (Rule) => Rule.required().error("Image is required"),
      },
      {
        name: "dateAdded",
        title: "Date Added",
        type: "datetime",
        description:
          "The date and time when this featured product section was created.",
        validation: (Rule) => Rule.required(),
      },
      {
        name: "description",
        title: "Description",
        type: "text",
        validation: (Rule) =>
          Rule.required()
            .max(350)
            .error(
              "Description is required and should be 350 characters or less"
            ),
      },
      {
        name: "price",
        title: "Price",
        type: "number",
        description: "The price of the featured product.",
        validation: (Rule) =>
          Rule.required()
            .min(0)
            .precision(2)
            .error(
              "The price must be a positive number with up to two decimal places."
            ),
      },
      {
        name: "inventory",
        title: "Inventory",
        type: "number",
        description: "The number of units available for this product.",
        validation: (Rule) =>
          Rule.required()
            .min(0)
            .error("Inventory must be a non-negative number."),
      },
    ],
  };