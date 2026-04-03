const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Policy = require('./models/Policy');
const User = require('./models/User');
const RiskZone = require('./models/RiskZone');
const Payout = require('./models/Payout');
const TriggerEvent = require('./models/TriggerEvent');
const bcrypt = require('bcryptjs');

dotenv.config();

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gigshield_db';
  await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
};

const importData = async () => {
  try {
    await connectDB();
    
    await Policy.deleteMany();
    await User.deleteMany();
    await RiskZone.deleteMany();
    await Payout.deleteMany();
    await TriggerEvent.deleteMany();

    // 1. Generate Risk Zones (Chennai)
    const zones = [
        { name: 'T. Nagar', rainRisk: 40, trafficRisk: 85, aqiRisk: 60, pricingMultiplier: 1.1 },
        { name: 'Velachery', rainRisk: 90, trafficRisk: 70, aqiRisk: 30, pricingMultiplier: 1.3 },
        { name: 'Adyar', rainRisk: 30, trafficRisk: 60, aqiRisk: 35, pricingMultiplier: 1.0 },
    ];
    await RiskZone.insertMany(zones);

    // 2. Generate Policies
    const createdPolicies = await Policy.insertMany([
      { name: 'Basic Plan', weeklyPremium: 39, maxPayout: 300, coveredDisruptions: ['Heavy Rain'] },
      { name: 'Standard Plan', weeklyPremium: 59, maxPayout: 600, coveredDisruptions: ['Heavy Rain', 'Extreme Heat', 'Traffic Gridlock'] },
      { name: 'Premium Plan', weeklyPremium: 89, maxPayout: 1000, coveredDisruptions: ['Heavy Rain', 'Extreme Heat', 'Traffic Gridlock', 'High Pollution', 'Local Shutdown'] }
    ]);

    // 3. Create Admin
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    await User.create({
        name: 'Super Admin',
        email: 'admin@kovera.ai',
        password: adminPassword,
        role: 'admin'
    });

    // 4. Create TriggerEvents (Historical & Recent)
    const event1 = await TriggerEvent.create({
      type: 'Heavy Rain', zone: 'Velachery', severity: 'Severe', metricValue: 42,
      startTime: new Date(Date.now() - 3600000), isSimulated: false
    });
    const event2 = await TriggerEvent.create({
      type: 'Extreme Heat', zone: 'T. Nagar', severity: 'Moderate', metricValue: 39,
      startTime: new Date(Date.now() - 7200000), isSimulated: false
    });

    // 5. Generate 100 Random Riders
    const riderNames = ['Arun', 'Bala', 'Deepak', 'Eswar', 'Farhad', 'Gokul', 'Hari', 'Indu', 'Jagan', 'Kunal', 'Lokesh', 'Muthu', 'Naveen', 'Omkar', 'Pradap', 'Qasim', 'Rahul', 'Siva', 'Thangam', 'Uday', 'Vijay', 'Yash', 'Zakir', 'Anand', 'Bharath', 'Chandru', 'Dinesh', 'Elango', ' गणेश', 'Hemant', 'Ilaya', 'Jesu', 'Kiran', 'Logan', 'Mani', 'Nanda', 'Oviya', 'Palan', 'Raghu', 'Sanjeev', 'Tamil', 'Uma', 'Vicky', 'William', 'Xavier', 'Yovan', 'Zayan'];
    const surnames = ['Kumar', 'Singh', 'Reddy', 'Sharma', 'Pillai', 'Iyer', 'Venkatesh', 'Babu', 'Devar', 'Naidu', 'Rao', 'Das', 'Dutta', 'Gupta', 'Malhotra', 'Joshi', 'Patel', 'Shah'];
    const platforms = ['Swiggy', 'Zomato', 'Zepto', 'Blinkit', 'Porter'];
    const zoneOptions = ['T. Nagar', 'Velachery', 'Adyar'];
    
    // Zone Coords for Chennai
    const coords = {
      'T. Nagar': { lat: 13.0405, lng: 80.2337 },
      'Velachery': { lat: 12.9801, lng: 80.2228 },
      'Adyar': { lat: 13.0033, lng: 80.2550 }
    };

    const riderPassword = await bcrypt.hash('rider123', salt);

    for (let i = 1; i <= 100; i++) {
        const firstName = riderNames[Math.floor(Math.random() * riderNames.length)];
        const lastName = surnames[Math.floor(Math.random() * surnames.length)];
        const platform = platforms[Math.floor(Math.random() * platforms.length)];
        const zoneName = zoneOptions[Math.floor(Math.random() * zoneOptions.length)];
        const fraudScore = Math.floor(Math.random() * 100);
        
        // Random Coordinate within zone
        const baseCoord = coords[zoneName];
        const lat = baseCoord.lat + (Math.random() - 0.5) * 0.02;
        const lng = baseCoord.lng + (Math.random() - 0.5) * 0.02;

        // Random Policy assignment (70% chance)
        const hasPolicy = Math.random() < 0.7;
        const selectedPolicy = hasPolicy ? createdPolicies[Math.floor(Math.random() * createdPolicies.length)] : null;
        const expiry = hasPolicy ? new Date(Date.now() + 604800000) : null;

        const rider = await User.create({
            name: `${firstName} ${lastName}`,
            email: `rider${i}@test.com`,
            password: riderPassword,
            role: 'worker',
            city: 'Chennai',
            deliveryPlatform: platform,
            primaryZone: zoneName,
            fraudScore: fraudScore,
            fraudStatus: fraudScore > 80 ? 'High Risk' : (fraudScore > 40 ? 'Medium Risk' : 'Low Risk'),
            avgWeeklyEarnings: 2000 + Math.floor(Math.random() * 3000),
            preferredWorkingHours: { start: '09:00', end: '18:00', shift: 'Flexible' },
            activePolicy: selectedPolicy?._id,
            policyExpiry: expiry,
            lastKnownLocation: { lat, lng }
        });

        // 6. Generate random claims (20% chance if has policy)
        if (hasPolicy && Math.random() < 0.2) {
           const event = (zoneName === 'Velachery') ? event1 : (zoneName === 'T. Nagar' ? event2 : event1);
           await Payout.create({
             user: rider._id,
             policy: selectedPolicy._id,
             triggerEvent: event._id,
             estimatedIncomeLoss: 450,
             eligiblePayout: 350,
             finalPayoutAmount: 350,
             confidenceScore: 92,
             fraudScoreSnapshot: fraudScore,
             status: Math.random() > 0.5 ? 'Approved' : 'Under Review',
             payoutReasoning: `Automatic trigger matching ${event.type} in ${zoneName}.`
           });
        }
    }

    console.log(`Successfully seeded Admin, 100 Riders with GPS, Policies and Claims!`);
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error}`);
    process.exit(1);
  }
};

importData();
