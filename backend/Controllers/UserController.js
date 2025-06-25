const geminiResponse = require("../gemini"); // ✅ FIXED
const moment = require("moment");
const User = require("../Models/user.models");
const { uploadOnCloudinary } = require("../Config/cloudinary");


exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Get current user error:", error);
    return res.status(500).json({ message: "Server error while fetching user" });
  }
};

exports.updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageurl } = req.body;
    let assistantImage;

    if (req.file) {
      try {
        assistantImage = await uploadOnCloudinary(req.file.path);
      } catch (cloudErr) {
        return res.status(500).json({ message: "Image upload failed" });
      }
    } else {
      assistantImage = imageurl;
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { assistantName, assistantImage },
      { new: true }
    ).select("-password");

    return res.status(200).json(user);
  } catch (error) {
    console.error("UpdateAssistant error:", error);
    return res.status(500).json({ message: "UpdateAssistant error" });
  }
};


exports.askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;
    const user = await User.findById(req.userId);
    user.history.push(command)
    user.save()
    const userName = user.name;
    const assistantName = user.assistantName;

    const result = await geminiResponse(command, assistantName, userName);

    if (!result) {
      return res.status(500).json({ response: "Assistant failed to respond." });
    }

    console.log("📦 Raw Gemini response:\n", result);

    const jsonMatch = result.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      return res.status(400).json({ response: "Sorry, I can't understand that." });
    }

    let gemResult;
    try {
      gemResult = JSON.parse(jsonMatch[0]);
    } catch (err) {
      console.error(" Error parsing JSON:", err);
      return res.status(400).json({ response: "Invalid response format." });
    }

    // ✅ Normalize type to handle get_time → get-time
    let { type, userInput } = gemResult;
    type = type.replace(/_/g, "-");

    switch (type) {
      case "get-date":
        return res.json({
          type,
          userInput,
          response: `Current date is ${moment().format("YYYY-MM-DD")}`,
        });

case "get-time":
  const currentTime = moment().format("hh:mm A"); // or "h:mm A"
  return res.json({
    type,
    userInput,
    response: `Current time is ${currentTime}`
  });


      case "get-day":
        return res.json({
          type,
          userInput,
          response: `Today is ${moment().format("dddd")}`,
        });

      case "get-month":
        return res.json({
          type,
          userInput,
          response: `Current month is ${moment().format("MMMM")}`,
        });

      case "general":
      case "google-search":
      case "youtube-search":
      case "youtube-play":
      case "calculator-open":
      case "instagram-open":
      case "facebook-open":
      case "weather-show":
        return res.json({
          type,
          userInput,
          response: gemResult.response,
        });

      default:
        return res.status(400).json({ response: "Sorry, I can't understand that." });
    }
  
  } catch (error) {
    console.error("❌ Error in askToAssistant:", error);
    return res.status(500).json({ response: "Internal server error" });
  }
};

