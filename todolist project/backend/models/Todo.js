const mongoose = require('mongoose');

/**
 * Todo Schema definition matching frontend requirements
 */
const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [1, 'Title cannot be empty'],
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    priority: {
      type: String,
      enum: {
        values: ['Low', 'Medium', 'High'],
        message: '{VALUE} is not a valid priority level'
      },
      default: 'Medium'
    },
    dueDate: {
      type: String,
      trim: true,
      default: () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
    },
    dueTime: {
      type: String,
      trim: true,
      default: ''
    },
    category: {
      type: String,
      trim: true,
      default: 'Work',
      enum: {
        values: ['Work', 'Personal', 'Design', 'DevOps', 'Study', 'Finance', 'Health', 'Other'],
        message: '{VALUE} is not a valid category'
      }
    },
    status: {
      type: String,
      enum: {
        values: ['Pending', 'Completed'],
        message: '{VALUE} is not a valid status'
      },
      default: 'Pending'
    },
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret.__v;
        return ret;
      }
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Synchronize status and completed fields before saving
todoSchema.pre('save', function (next) {
  if (this.isModified('status') && !this.isModified('completed')) {
    this.completed = this.status === 'Completed';
    this.completedAt = this.completed ? (this.completedAt || new Date()) : null;
  } else if (this.isModified('completed') && !this.isModified('status')) {
    this.status = this.completed ? 'Completed' : 'Pending';
    this.completedAt = this.completed ? (this.completedAt || new Date()) : null;
  }
  next();
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
