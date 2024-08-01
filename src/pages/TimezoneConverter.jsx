import {
  Box,
  Button,
  Flex,
  Heading,
  Select,
  Slider,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import moment from "moment-timezone";
import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import { FaRegCalendarPlus } from "react-icons/fa6";
import { IoIosLink, IoIosMoon } from "react-icons/io";
import { LuSunMoon } from "react-icons/lu";
import { MdClose, MdOutlineSwapVert } from "react-icons/md";
import { RiDraggable } from "react-icons/ri";
import { RxDragHandleVertical } from "react-icons/rx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const timezonesList = [
  { name: "UTC", offset: 0 },
  { name: "IST", offset: 5.5 },
  { name: "EST", offset: -5 },
  { name: "PST", offset: -8 },
  { name: "CET", offset: 1 },
  { name: "EET", offset: 2 },
  { name: "JST", offset: 9 },
  { name: "AEST", offset: 10 },
  { name: "AKST", offset: -9 },
  { name: "MSK", offset: 3 },
];

const TimezoneConverter = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timezones, setTimezones] = useState([]);
  const [selectedTimezone, setSelectedTimezone] = useState("");

  useEffect(() => {
    const currentUtcMinutes =
      moment().utc().hours() * 60 + moment().utc().minutes();
    const urlParams = new URLSearchParams(window.location.search);
    const savedTimezones = urlParams.get("timezones");
    if (savedTimezones) {
      const parsedTimezones = JSON.parse(savedTimezones);
      setTimezones(
        parsedTimezones.map((tz) => ({
          ...tz,
          time: moment()
            .utc()
            .startOf("day")
            .add(currentUtcMinutes + tz.offset * 60, "minutes"),
        }))
      );
    }
  }, []);

  const updateUrlParams = (newTimezones) => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("timezones", JSON.stringify(newTimezones));
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    window.history.replaceState(null, "", newUrl);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const newOrder = Array.from(timezones);
    const [moved] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, moved);
    setTimezones(newOrder);
    updateUrlParams(newOrder);
  };

  const handleRemove = (name) => {
    const newTimezones = timezones.filter((tz) => tz.name !== name);
    setTimezones(newTimezones);
    updateUrlParams(newTimezones);
  };

  const handleTimeChange = (value, changedTimezone) => {
    const newTime = moment()
      .utc()
      .startOf("day")
      .add(value * 15, "minutes")
      .add(changedTimezone.offset, "hours");

    const newTimezones = timezones.map((tz) => {
      const offsetDifference = tz.offset - changedTimezone.offset;
      const updatedTime = newTime.clone().subtract(offsetDifference, "hours");

      return tz.name === changedTimezone.name
        ? { ...tz, time: newTime }
        : { ...tz, time: updatedTime };
    });

    setTimezones(newTimezones);
    updateUrlParams(newTimezones);
  };

  const formatTime = (minutes, offset) => {
    const totalMinutes = (minutes + offset * 60 + 24 * 60) % (24 * 60);
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    const period = hrs >= 12 ? "PM" : "AM";
    const formattedHours = hrs % 12 === 0 ? 12 : hrs % 12;
    return `${formattedHours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")} ${period}`;
  };

  const addTimezone = (name, offset) => {
    const currentUtcMinutes =
      moment().utc().hours() * 60 + moment().utc().minutes();
    const newTimezone = {
      id: timezones.length + 1,
      name,
      offset,
      time: moment()
        .utc()
        .startOf("day")
        .add(currentUtcMinutes + offset * 60, "minutes"),
    };

    const newTimezones = [...timezones, newTimezone];
    setTimezones(newTimezones);
    updateUrlParams(newTimezones);
    setSelectedTimezone("");
  };

  const handleSelectChange = (event, timezone) => {
    const [time, period] = event.target.value.split(" ");
    const [hours, minutes] = time.split(":").map(Number);
    let newHours = hours % 12;
    if (period === "PM") {
      newHours += 12;
    }
    const totalMinutes = newHours * 60 + minutes;
    const utcMinutes =
      (totalMinutes - timezone.offset * 60 + 24 * 60) % (24 * 60);
    handleTimeChange(Math.floor(utcMinutes / 15), timezone);
  };

  const getTimeOptions = (timezone) => {
    const options = [];
    for (let i = 0; i < 24 * 60; i += 15) {
      const formattedTime = formatTime(i, timezone.offset);
      options.push(
        <option key={i} value={formattedTime}>
          {formattedTime}
        </option>
      );
    }
    return options;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const sliderLabels = [];
  for (let i = 0; i <= 24 * 60; i += 180) {
    const hour = (i / 60) % 24;
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    sliderLabels.push(
      `${formattedHour.toString().padStart(2, "0")}:00 ${period}`
    );
  }

  const handleReverse = () => {
    const reversedTimezones = [...timezones].reverse();
    setTimezones(reversedTimezones);
    updateUrlParams(reversedTimezones);
  };

  const handleScheduleMeet = () => {
    const currentTimeUserTimezone = selectedDate;

    currentTimeUserTimezone.setHours(currentTimeUserTimezone.getHours() + 10);
    currentTimeUserTimezone.setMinutes(
      currentTimeUserTimezone.getMinutes() + 55
    );

    const timezoneOffsetMilliseconds =
      currentTimeUserTimezone.getTimezoneOffset() * 60 * 1000;

    const currentTimeUTC = new Date(
      currentTimeUserTimezone.getTime() + timezoneOffsetMilliseconds
    );

    const endTimeUTC = new Date(currentTimeUTC.getTime() + 2 * 60 * 60 * 1000);

    const startTimeFormatted = currentTimeUTC
      .toISOString()
      .replace(/[:\-.]/g, "")
      .slice(0, -5);
    const endTimeFormatted = endTimeUTC
      .toISOString()
      .replace(/[:\-.]/g, "")
      .slice(0, -5);

    const timezoneOffsetHours = Math.abs(
      Math.floor(currentTimeUserTimezone.getTimezoneOffset() / 60)
    )
      .toString()
      .padStart(2, "0");
    const timezoneOffsetMinutesRemainder = Math.abs(
      currentTimeUserTimezone.getTimezoneOffset() % 60
    )
      .toString()
      .padStart(2, "0");
    const timezoneOffsetSign =
      currentTimeUserTimezone.getTimezoneOffset() < 0 ? "+" : "-";
    const timezoneOffsetFormatted =
      timezoneOffsetSign + timezoneOffsetHours + timezoneOffsetMinutesRemainder;

    const googleCalendarURL = `https://calendar.google.com/calendar/u/0/r/eventedit?text=Schedule+Meet&dates=${startTimeFormatted}/${endTimeFormatted}&ctz=${timezoneOffsetFormatted}&details=Meeting+details&location=Online`;

    window.open(googleCalendarURL, "_blank");
  };

  return (
    <>
      <Heading textAlign={"center"} mt={8}>
        Timezone Converter
      </Heading>
      <Box ml={16} mr={16} mt={4} p={4} borderWidth="1px" borderRadius="lg">
        <Flex justifyContent="space-between" alignItems="center" wrap={"wrap"}>
          <Select
            w="300px"
            value={selectedTimezone}
            onChange={(e) => {
              const selectedTimezone = timezonesList.find(
                (tz) => tz.name === e.target.value
              );
              if (
                selectedTimezone &&
                !timezones.some((tz) => tz.name === selectedTimezone.name)
              ) {
                // console.log(selectedTimezone);
                addTimezone(selectedTimezone.name, selectedTimezone.offset);
              } else {
                toast.error("Timezone already added!");
              }
            }}
            style={{
              fontWeight: "100",
              color: useColorModeValue("#7c7978", "#74787a"),
            }}
          >
            <option value="" disabled>
              Select a timezone
            </option>
            {timezonesList.map((tz) => (
              <option key={tz.name} value={tz.name}>
                {tz.name}
              </option>
            ))}
          </Select>

          <Box
            display="flex"
            alignItems="center"
            bg={useColorModeValue("white", "gray.800")}
            p={"7px"}
            borderRadius="md"
            border="1px solid"
            borderColor={useColorModeValue("gray.200", "gray.700")}
          >
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              className="custom-datepicker"
            />
            <FaCalendarAlt color={"#60bfd8"} />
          </Box>
          <Flex>
            <Button borderRadius={0} onClick={handleScheduleMeet}>
              <FaRegCalendarPlus color={"#60bfd8"} />
            </Button>
            <Button borderRadius={0} onClick={handleReverse}>
              <MdOutlineSwapVert color={"#60bfd8"} />
            </Button>
            <Button onClick={handleCopyLink} borderRadius={0}>
              <IoIosLink color={"#60bfd8"} />
            </Button>
            <Button
              aria-label="Toggle Color Mode"
              onClick={toggleColorMode}
              borderRadius={0}
            >
              {colorMode === "light" ? (
                <IoIosMoon color={"#60bfd8"} />
              ) : (
                <LuSunMoon color={"#60bfd8"} />
              )}
            </Button>
          </Flex>
        </Flex>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="timezones">
            {(provided) => (
              <Box ref={provided.innerRef} {...provided.droppableProps}>
                {timezones.map((timezone, index) => (
                  <Draggable
                    key={timezone.name}
                    draggableId={timezone.name}
                    index={index}
                  >
                    {(provided) => (
                      <Flex
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        alignItems="center"
                        justifyContent="space-between"
                        mt={4}
                        p={4}
                        bg={useColorModeValue("gray.100", "gray.700")}
                        borderRadius="md"
                        flexDirection="column"
                        position="relative"
                      >
                        <Box w="100%">
                          <Flex gap={"10px"}>
                            <Box pos={"relative"}>
                              {Array.from(
                                { length: 8 },
                                (_, index) => index * 12
                              ).map((top, index) => (
                                <RiDraggable
                                  key={index}
                                  style={{
                                    position: "absolute",
                                    top: `${top}px`,
                                    left: "-10px",
                                  }}
                                />
                              ))}
                            </Box>
                            <Box w={"100%"}>
                              <Flex
                                justifyContent="space-between"
                                alignItems="center"
                              >
                                <Text fontSize="lg" fontWeight="bold">
                                  {timezone.name}
                                </Text>
                                {/* <IconButton
                                  icon={}
                                  aria-label="Remove timezone"
                                  
                                  position="absolute"
                                  top={2}
                                  right={2}
                                /> */}
                                <MdClose
                                  onClick={() => handleRemove(timezone.name)}
                                  style={{ color: "red" }}
                                />
                              </Flex>
                              <Flex
                                justifyContent="space-between"
                                alignItems="center"
                                mt={2}
                              >
                                <Text fontWeight="bold" fontSize="xl">
                                  {formatTime(
                                    timezone.time.hours() * 60 +
                                      timezone.time.minutes(),
                                    0
                                  )}
                                </Text>
                                <Box>
                                  <Select
                                    value={formatTime(
                                      timezone.time.hours() * 60 +
                                        timezone.time.minutes(),
                                      0
                                    )}
                                    onChange={(e) =>
                                      handleSelectChange(e, timezone)
                                    }
                                    fontWeight="bold"
                                    w="auto"
                                    borderRadius={0}
                                    minW={200}
                                    textAlign={"center"}
                                  >
                                    {getTimeOptions(timezone)}
                                  </Select>
                                  <Flex
                                    width={200}
                                    justifyContent={"space-between"}
                                  >
                                    <Text>
                                      GMT{" "}
                                      {timezone.offset.toString()[0] >= "0"
                                        ? "+"
                                        : "-"}
                                      {timezone.name == "UTC"
                                        ? "0"
                                        : formatTime(0, timezone.offset).split(
                                            " "
                                          )[0]}
                                    </Text>
                                    <Text>
                                      {selectedDate
                                        .toDateString()
                                        .split(" ")
                                        .slice(0, 3)
                                        .join(" ")}
                                    </Text>
                                  </Flex>
                                </Box>
                              </Flex>
                            </Box>
                          </Flex>
                          <Slider
                            // min={0}
                            max={(24 * 60) / 15 - 1}
                            aria-label="slider-ex-1"
                            defaultValue={5}
                            min={0}
                            // max={10}
                            step={1}
                            onChange={(value) =>
                              handleTimeChange(value, timezone)
                            }
                            value={
                              (timezone.time.hours() * 60 +
                                timezone.time.minutes()) /
                              15
                            }
                            mt={4}
                            h={8}
                          >
                            {/* <SliderTrack
                              h={8}
                              bgGradient="linear(to-r, blue.500, green.500)"
                              display={"flex"}
                              justifyContent={"space-around"}
                            >
                              <SliderMark>|</SliderMark>
                            </SliderTrack> */}

                            <SliderTrack
                              h={8}
                              bgGradient={useColorModeValue(
                                "linear(to-r, blue.500 0%, blue.500 20%, lightyellow 30%, lightyellow 70%, blue.500 80%, blue.500 100%)",
                                "linear(to-r, blue.500 0%, blue.500 20%, #f9e6a8 30%, #f9e6a8 70%, blue.500 80%, blue.500 100%)"
                              )}
                              display="flex"
                              justifyContent="space-between"
                            >
                              {Array.from(
                                { length: (24 * 60) / 15 - 1 + 1 },
                                (_, i) => i
                              ).map((mark) => {
                                // console.log(mark);
                                return (
                                  <SliderMark
                                    key={mark}
                                    value={mark}
                                    bg="transparent"
                                    color="#9aafc6"
                                    fontSize="lg"
                                  >
                                    |
                                  </SliderMark>
                                );
                              })}
                            </SliderTrack>
                            {/* <SliderFilledTrack bg="blue.600" /> */}
                            {/* <SliderThumb boxSize={6} /> */}

                            <Box boxShadow={"Dark lg"}>
                              <SliderThumb
                                boxSize={8}
                                borderRadius="sm"
                                grabbable
                              >
                                <RxDragHandleVertical color="#9aafc6" />
                              </SliderThumb>
                            </Box>
                          </Slider>
                          <Flex justifyContent="space-between" mt={2}>
                            {sliderLabels.map((label, i) => (
                              <Text key={i}>{label}</Text>
                            ))}
                          </Flex>
                        </Box>
                      </Flex>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
      </Box>
      <ToastContainer />
    </>
  );
};

export { TimezoneConverter };
