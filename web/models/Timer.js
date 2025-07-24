import mongoose from 'mongoose';

const timerSchema = new mongoose.Schema({
  shop: { 
    type: String, 
    required: true, 
    index: true,
    trim: true
  },
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  description: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 500
  },
  startDate: { 
    type: Date, 
    required: true 
  },
  endDate: { 
    type: Date, 
    required: true,
    validate: {
      validator: function(value) {
        const diffMs = value - this.startDate;
        return diffMs > 0 && diffMs <= 24 * 60 * 60 * 1000; // Max 1 day
      },
      message: 'Timer duration must be greater than 0 and not exceed 1 day'
    }
  },
  color: { type: String, default: '#00ff00' },

  size: {
    type: String,
    enum: ['Small', 'Medium', 'Large'],
    default: 'Medium'
  },

  position: {
    type: String,
    enum: ['Top', 'Bottom'],
    default: 'Top'
  },

  urgencyNotification: {
    type: String,
    enum: ['Color pulse', 'Shake', 'Blink'],
    default: 'Color pulse'
  },

  isActive: { 
    type: Boolean, 
    default: true 
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
timerSchema.index({ shop: 1, createdAt: -1 });
timerSchema.index({ shop: 1, isActive: 1, startDate: 1, endDate: 1 });

// Virtual
timerSchema.virtual('status').get(function () {
  const now = new Date();
  if (!this.isActive) return 'inactive';
  if (now < this.startDate) return 'scheduled';
  if (now > this.endDate) return 'expired';
  return 'active';
});

// Static methods
timerSchema.statics.findActiveForShop = function(shop) {
  const now = new Date();
  return this.find({
    shop,
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now }
  }).sort({ createdAt: -1 });
};

timerSchema.statics.findByShop = function(shop) {
  return this.find({ shop }).sort({ createdAt: -1 });
};

const Timer = mongoose.model('Timer', timerSchema);
export default Timer;

