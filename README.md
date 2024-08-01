```markdown
# Timezone Converter

## Overview

The Timezone Converter is a React application that allows users to convert and compare times across different timezones. It features drag-and-drop reordering of timezones, a slider to adjust time, and the ability to schedule meetings using Google Calendar.

## Features

- **Timezone Management**: Add, remove, and reorder timezones.
- **Time Adjustment**: Adjust the time for each timezone using a slider.
- **Date Picker**: Select and display a date for scheduling.
- **Google Calendar Integration**: Generate a link to schedule meetings in Google Calendar.
- **Copy Link**: Copy the application link to the clipboard.
- **Dark Mode**: Toggle between light and dark themes.

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/your-repository.git
   cd your-repository
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

   The application will be available at `http://localhost:3000`.

## Usage

1. **Add Timezones**: Select a timezone from the dropdown to add it to the list.
2. **Reorder Timezones**: Drag and drop timezones to reorder them.
3. **Adjust Time**: Use the slider to adjust the time for each timezone.
4. **Date Picker**: Select a date to schedule a meeting.
5. **Schedule Meet**: Click the Google Calendar icon to open a new event in Google Calendar with the selected date and time.
6. **Copy Link**: Click the link icon to copy the application's URL to the clipboard.
7. **Toggle Dark Mode**: Switch between light and dark themes.

## ScreenShots

![image](https://github.com/user-attachments/assets/e170384e-4a51-4f8a-a399-b1d938c9ed49)
![image](https://github.com/user-attachments/assets/43a833bf-b0c0-43f7-9472-a12f5e67ef98)

## URL Parameters

- **timezones**: Pass a JSON-encoded array of timezones in the URL to pre-select timezones when opening the app.

  Example URL with parameters:
  ```
  http://localhost:3000/?timezones=%5B%7B%22name%22%3A%22UTC%22%2C%22offset%22%3A0%7D%2C%7B%22name%22%3A%22EST%22%2C%22offset%22%3A-5%7D%5D
  ```

## Dependencies

- `react`
- `react-dom`
- `react-datepicker`
- `moment-timezone`
- `react-beautiful-dnd`
- `@chakra-ui/react`
- `react-toastify`

## Contact

For any questions or feedback, please reach out to [zeeshanahmad6871@gmail.com](mailto:zeeshanahmad6871@gmail.com).

```
