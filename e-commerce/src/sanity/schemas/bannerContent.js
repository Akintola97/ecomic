export const bannerContent = {
    name: 'banner',
    title: 'Banner',
    type: 'document',
    fields:[
        {
            name: 'title',
            title: 'Image Title',
            type: "string",
            validation: Rule => Rule.required().error("Image title is required")
        },
        {
            name: 'author',
            title: 'Author',
            type: 'string',
            validation: Rule => Rule.required().error('Author name is required'),
          },
        {
            name: "slug",
            title: 'Slug',
            type: "slug",
            options:{
                source: 'title',
            },
            validation: Rule => Rule.required().error("Slug is required")
        },
        {
            name: "image",
            title: 'Image',
            type: "image",
            options:{
                hotspot: true,
            },
            validation: Rule => Rule.required().error("Image is required")
        },
        {
            name: "issues",
            title: 'issues',
            type: 'text',
            validation: Rule => Rule.required().max(250).error('Issue is required and should be 250 characters or less'),
          },

        {
            name: 'description',
            title: 'Description',
            type: 'text',
            validation: Rule => Rule.required().max(350).error('Description is required and should be 350 characters or less'),
          },
          {
            name: "dateCreated",
            title: 'Date Created',
            type: "datetime",
            validation: Rule => Rule.required().error("Date created is required")
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
    ]
}