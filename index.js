const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

const courseSchema = new mongoose.Schema({
    name: { type: String,
         required: true,
         minlength: 5,
         maxlength: 255,
        //  match: /pattern/
    },
    category: {
        type: String,
        required: true,
        enum: ['web', 'mobile', 'network'],
        lowercase: true,
        // uppercase: true
        trim: true
    },     
    author: String,
    tags: {
        type: Array,
      validate: {
          isAsync:true,
          validator: function(value, callback) {
            setTimeout(() => {
                // Do some async work
                const result = value && value.length > 0;
                callback(result);
            }, 4000);
        },
        message: 'A course should have at least one tag.'
      }
    },
    date: { type: Date, default: Date.now },
    isPublished: Boolean,
    price: {
        type: Number, 
        required: function() { return this.isPublished; }, 
        min: 10,
        max: 200,
        get: v => Math.round(v),
        set: v => Math.round(v)
    }
});
const Course = mongoose.model('Course', courseSchema);

async function createCourse() {
    const course = new Course({
        name: 'Angular Course',
        category: 'Web',
        author: 'Mosh',
        tags: ['frontend'],
        isPublished: true,
        price: 15.2
    });
    try{
        const result = await course.save();
        console.log(result);
    }catch(exception){
        for (field in exception.errors)
            console.log(exception.errors[field].message);
    }
}
    

async function getCourse() {

// equality operators    
    // eq (equal to)
    // ne (not equal to)
    // gt (greater than)
    // gte (greater than or equal to)
    // lt (less than)
    // in
    // nin (not in)

// logical operators
    // or
    // and

// regular expressions
    // Starts with Mosh
    // Ends with Hamedani
    // Contains Mosh


    // .find({ price: { $gte: 10, lte: 20 } })
    // .find({ price: { $in: [10, 15, 20] } })

    // . find()
    // .or([ { author: 'Mosh' }, { isPublished: true } ])

    // // Starts with Mosh
    // .find({ author: /^Mosh/ })
    // // Ends with Hamedani
    // .find({ author: /Hamedani$/i })
    // // Contains Mosh
    // .find({ /.*Mosh.*/})

    // const pageNumber = 2;
    // const pageSize = 10; 

    
    // count()

    const courses = await Course
        .find({ _id: '5e71fa181dd25c437c3acebd' })
        // .skip((pageNumber - 1) * pageSize)
        // .limit(pageSize)
        .sort({ name: 1 })
        .select({ name: 1, tags: 1, price: 1 })
    console.log(courses[0].price);

}

async function updateCourse(id){
// 1. Approach: Query first
// findById()
// Modify its properties
// save()
const course = await Course.findById(id);
if (!course) return;

course.isPublished = true;
course.author = 'Another Author';
const result = await course.save();
console.log(result);

// course.set({
//     isPublished: true,
//     author: 'Another Author'
// });

// 2. Approach: Update first
// Update directly
// Optionally: Get the updated document 
}
getCourse();