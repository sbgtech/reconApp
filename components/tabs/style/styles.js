import { Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get("window");
const marginBottomAndroid = height * 0.09; // Adjust 0.05 as needed for your layout
const marginBottomIOS = height * 0.01; // Adjust 0.05 as needed for your layout

export const styles = {
  // In the most tabs
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  // WellStatus.js - statisticsTab.js - TestTab.js
  marginBottomContainer: {
    marginBottom:
      Platform.OS === "android" ? marginBottomAndroid : marginBottomIOS,
  },
  /* ------------------------------ */
  // RefreshBtn.js
  refreshBtnWrapper: {
    marginHorizontal: 14,
    marginTop: 16,
  },
  // RefreshBtn.js
  refreshBtn: (width) => ({
    paddingHorizontal: 12,
    height: width < 600 ? 36 : width < 800 ? 36 : width < 950 ? 44 : 44,
    maxHeight: 90,
  }),
  /* ------------------------------ */
  // Menu.js --> Modal
  renameModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  renameModalContent: (width) => ({
    width:
      width < 600 ? "80%" : width < 800 ? "60%" : width < 950 ? "70%" : "60%",
    backgroundColor: "white",
    padding: 20,
    elevation: 5, // For Android shadow
    shadowColor: "#000", // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  }),
  renameModalCurrentNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  renameModalLabel: (width) => ({
    fontSize: width < 600 ? 16 : width < 800 ? 16 : width < 950 ? 22 : 24,
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "center",
  }),
  renameModalInput: (width) => ({
    borderWidth: 1,
    borderColor: "#0055a4",
    padding: width < 600 ? 8 : width < 800 ? 8 : width < 950 ? 10 : 12,
    marginBottom: 14,
    fontSize: width < 600 ? 14 : width < 800 ? 14 : width < 950 ? 22 : 24,
  }),
  renameModalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  renameButton: (width) => ({
    paddingHorizontal:
      width < 600 ? 14 : width < 800 ? 14 : width < 950 ? 22 : 24,
    paddingVertical: width < 600 ? 6 : width < 800 ? 6 : width < 950 ? 8 : 10,
  }),
  /* ------------------------------ */
  // MenuItem.js
  menuItemView: (width) => ({
    backgroundColor: "#fff",
    marginHorizontal: 14,
    marginVertical: width < 600 ? 4 : 2,
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 12,
  }),
  // MenuItem.js
  menuIconView: (width) => ({
    padding: width < 600 ? 14 : width < 800 ? 12 : width < 950 ? 16 : 18,
    backgroundColor: "#0055a4",
  }),
  // MenuItem.js
  menuIconSize: (width) =>
    width < 600 ? 20 : width < 800 ? 20 : width < 950 ? 24 : 30,

  // MenuItem.js
  menuTextView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 4,
  },
  // MenuItem.js
  menuTextSize: (width) => ({
    fontSize: width < 600 ? 18 : width < 800 ? 16 : width < 950 ? 20 : 24,
  }),
  /* ------------------------------ */
  // WellStatusTab.js
  statusContainer: (width) => ({
    marginHorizontal: 14,
    marginTop: 16,
    padding: 14,
    backgroundColor: "#eeeeee",
    flexDirection: width > 600 ? "row" : "column",
    flexWrap: width > 600 ? "wrap" : "nowrap",
    justifyContent:
      width < 600
        ? "flex-start"
        : width > 950
        ? "space-between"
        : "space-between",
    // gap: width < 600 ? 20 : width > 950 ? 30 : 30,
  }),
  // WellStatusTab.js
  statusWrapper: (width) => ({
    flexDirection: width > 600 ? "row" : "row",
    flexWrap: width > 600 ? "wrap" : "nowrap",
    justifyContent: "space-between",
    alignItems: width > 600 ? "center" : "baseline",
    padding: width < 600 ? 7 : width < 800 ? 7 : width < 950 ? 10 : 10,
    backgroundColor: "#fff",
    alignContent: "center",
    margin: width < 600 ? 2 : width < 800 ? 2 : width < 950 ? 4 : 4,
    width:
      width < 600
        ? "auto"
        : width < 800
        ? width / 2.3
        : width < 950
        ? width / 2.3
        : width / 3.4,
  }),
  // WellStatusTab.js
  emptyStatusWrapper: (width) => ({
    // padding: width > 600 ? 0 : 7,
    margin: width < 600 ? 0 : 4,
    width:
      width < 600
        ? "auto"
        : width < 800
        ? width / 2.5
        : width < 950
        ? width / 2.3
        : width / 3.4,
  }),
  // WellStatusTab.js
  statusText: (width) => ({
    fontSize: width < 600 ? 14 : width < 800 ? 14 : width < 950 ? 18 : 20,
  }),
  // WellStatusTab.js
  statusValue: (width) => ({
    fontSize: width < 600 ? 14 : width < 800 ? 14 : width < 950 ? 18 : 20,
  }),
  // WellStatusTab.js
  arrivalContainer: {
    marginHorizontal: 14,
    marginTop: 16,
    padding: 14,
    backgroundColor: "#eeeeee",
  },
  // Arrival.js
  arrivalWrapper: (width) => ({
    padding: 1,
    maxHeight: width < 960 ? 400 : 250,
  }),
  arrivalItemsContainer: (width) => ({
    flexDirection: width > 600 ? "row" : "column",
    flexWrap: width > 600 ? "wrap" : "nowrap",
    justifyContent:
      width < 600
        ? "flex-start"
        : width > 950
        ? "space-between"
        : "space-between",
  }),
  // Arrival.js
  arrivalItems: (width) => ({
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    margin: 2,
    backgroundColor: "#ffffff",
    width:
      width < 600
        ? "auto"
        : width < 800
        ? width / 2.3
        : width < 950
        ? width / 2.3
        : width / 3.4,
  }),
  // Arrival.js
  emptyArrivalItems: (width) => ({
    margin: width < 600 ? 2 : 4,
    // backgroundColor: "#ffffff",
    width:
      width < 600
        ? "auto"
        : width < 800
        ? width / 2.3
        : width < 950
        ? width / 2.3
        : width / 3.4,
  }),
  // Arrival.js
  arrivalName: (width) => ({
    fontSize: width < 600 ? 14 : width < 800 ? 15 : width < 950 ? 18 : 20,
  }),
  // Arrival.js
  arrivalValue: (width) => ({
    fontSize: width < 600 ? 14 : width < 800 ? 15 : width < 950 ? 18 : 20,
  }),
  // WellStatusTab.js
  telemetryDataContainer: {
    marginHorizontal: 14,
    marginTop: 16,
    padding: 14,
    backgroundColor: "#eeeeee",
  },
  // Table.js
  tableContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  // Table.js
  tableHeader: {
    backgroundColor: "#0055a4",
  },
  // Table.js
  tableHeaderText: (width) => ({
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    padding: width < 600 ? 8 : width < 800 ? 8 : width < 950 ? 10 : 10,
    fontSize: width < 600 ? 14 : width < 800 ? 14 : width < 950 ? 18 : 20,
  }),
  // Table.js
  dataTableContainer: (width) => ({
    flexDirection: width > 600 ? "row" : "column",
    flexWrap: width > 600 ? "wrap" : "nowrap",
    justifyContent: "space-between",
  }),
  // Table.js
  tableRow: (width) => ({
    flexDirection: width > 600 ? "row" : "row",
    justifyContent: "space-between",
    borderTopWidth: 3,
    borderColor: "#eeeeee",
    width:
      width < 600
        ? "auto"
        : width < 800
        ? width / 2.3
        : width < 950
        ? width / 2.3
        : width / 3.4,
  }),
  // Table.js
  tableCell: (width) => ({
    padding: 10,
    borderColor: "#D4D4D4",
    fontSize: width < 600 ? 14 : width < 800 ? 14 : width < 950 ? 18 : 20,
  }),

  /* ------------------------------------------- */
  // TimerTab.js
  timersContainer: (width) => ({
    // height: height,
    flexDirection: width > 600 ? "row" : "column",
    flexWrap: width > 600 ? "wrap" : "nowrap",
    justifyContent: width > 600 ? "space-between" : "flex-start",
    gap: width > 600 ? 30 : 20,
    marginHorizontal: 14,
    marginTop: width > 600 ? 25 : 15,
    marginBottom: width > 600 ? 50 : 50,
  }),
  // TimerTab.js
  timerIntermitContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    gap: 30,
    marginHorizontal: 26,
    marginTop: 25,
    marginBottom: 50,
  },
  // TimerTab.js
  pressureIntermitContainer: (width) => ({
    flexDirection: "column",
    justifyContent: "space-between",
    gap: width > 600 ? 20 : 10,
  }),
  // TimerTab.js
  pressureIntermitContent: (width) => ({
    flexDirection: width > 600 ? "row" : "column",
    flexWrap: width > 600 ? "wrap" : "nowrap",
    justifyContent: width > 600 ? "space-between" : "flex-start",
    gap: width > 600 ? 30 : 10,
    marginHorizontal: 26,
    marginTop: width > 600 ? 25 : 10,
  }),
  // TimerTab.js
  pressureIntermitBtnContainer: {
    marginHorizontal: 26,
    // marginBottom: 20,
    width: "auto",
  },
  // Timer.js
  wrapper: (width) => ({
    padding: 12,
    backgroundColor: "#eeeeee",
    width: width < 600 ? "auto" : width > 1100 ? width / 3.4 : width / 2.3,
  }),

  // Timer.js - statisticsTab.js - Valve.js
  valveTitle: {
    fontWeight: "bold",
    fontStyle: "italic",
    marginBottom: 10,
    fontSize: width < 600 ? 18 : width < 800 ? 18 : width < 950 ? 24 : 30,
  },

  // Timer.js- statisticsTab.js - SettingsTab.js
  rangeWrapper: {
    backgroundColor: "#ddd",
    padding: 10,
  },
  // Timer.js
  containerRange: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    gap: width > 600 ? 8 : 16,
    // padding: width > 600 ? 8  : 8 ,
  },
  // Timer.js
  timersInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: width > 600 ? 6 : 5,
    // width: "auto",
  },
  // Timer.js
  inputTimer: (width) => ({
    backgroundColor: "#fff",
    textAlign: "center",
    borderWidth: 0.5,
    borderColor: "grey",
    fontWeight: "bold",
    color: "#000",
    fontSize: width < 600 ? 15 : width < 800 ? 14 : width < 950 ? 18 : 20,
    width: width < 600 ? 53 : width < 800 ? 50 : width < 950 ? 57 : 57,
    maxWidth: 90,
    height: width < 600 ? 40 : width < 800 ? 36 : width < 950 ? 45 : 45,
    maxHeight: 90,
  }),
  // Timer.js
  dotTimer: {
    fontSize: width < 600 ? 20 : width < 800 ? 16 : width < 950 ? 20 : 20,
    fontWeight: width < 600 ? "normal" : "bold",
  },
  // Timer.js
  TimersbtnContainer: {
    width: width < 600 ? "auto" : width > 850 ? "30%" : "auto",
  },
  // Timer.js - SettingsTab.js - Statistics.js
  btnSendText: (width) => ({
    paddingHorizontal: 12,
    height: width < 600 ? 36 : width < 800 ? 33 : width < 950 ? 42 : 42,
    maxHeight: 90,
    width: "100%",
  }),
  // Timer.js - SettingsTab.js - Statistics.js
  TextSendStyle: (width) => ({
    fontSize: width < 600 ? 14 : width < 800 ? 14 : width < 950 ? 20 : 22,
    padding: 2,
  }),
  /* ------------------------------------------- */
  // SettingsTab.js
  settingsWrapper: {
    marginHorizontal: 14,
    marginTop: 14,
    padding: 14,
    backgroundColor: "#eeeeee",
    width: "auto",
  },
  // SettingsTab.js
  settingsSectionContainer: (width) => ({
    flexDirection: width > 600 ? "row" : "column",
    flexWrap: width > 600 ? "wrap" : "nowrap",
    justifyContent:
      width < 600
        ? "flex-start"
        : width > 950
        ? "space-between"
        : "space-between",
    alignItems: width > 600 ? "flex-start" : "baseline",
    width: "auto",
    // gap: width < 600 ? 14 : width > 950 ? 14 : 14,
  }),
  // SettingsTab.js
  settingsSection: (width) => ({
    flexDirection: "column",
    justifyContent: "flex-start",
    gap: width < 600 ? 8 : 16,
    // height: width < 600 ? "auto" : 450,
    // height: width < 600 ? "auto" : width > 950 ? 590 : 550,
    height: "auto",
    // maxHeight: width < 600 ? "auto" : width > 950 ? 590 : 550,
    width:
      width < 600
        ? "100%"
        : width < 800
        ? width / 2.3
        : width < 950
        ? width / 2.3
        : width / 3.4,
    backgroundColor: "#ddd",
    padding: width * 0.01,
    marginBottom: 20,
  }),
  // SettingsTab.js - StatisticsTab.js
  titleSettings: (width) => ({
    fontSize: width < 600 ? 14 : width < 800 ? 14 : width < 950 ? 18 : 20,
    fontWeight: "bold",
    marginTop: 10,
  }),
  // SettingsTab.js
  inputSettings: (width) => ({
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    marginVertical: 2,
    borderWidth: 0.5,
    width: "100%",
    maxWidth: "100%",
    height: width < 600 ? 38 : width < 800 ? 36 : width < 950 ? 44 : 44,
    fontSize: width < 600 ? 14 : width < 800 ? 14 : width < 950 ? 18 : 20,
    color: "#000",
  }),
  // SettingsTab.js
  inputContainer: {
    paddingHorizontal: 5,
  },
  // SettingsTab.js
  containerBtnText: {
    marginVertical: 4,
    paddingHorizontal: 5,
    width: "100%",
    maxWidth: "100%",
    height: width < 600 ? 34 : width < 800 ? 33 : width < 950 ? 40 : 40,
  },
  // SettingsTab.js
  pidInputsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 30,
  },
  // SettingsTab.js
  pidInputs: { flex: 1 },
  // SettingsTab.js
  valveContainer: {
    flexDirection: width < 600 ? "row" : "row",
    justifyContent: width > 600 ? "space-between" : "space-between",
    alignItems: width > 600 ? "center" : "center",
  },
  /* ------------------------------------------- */
  // Valve.js
  valveWrapper: {
    marginHorizontal: 14,
    marginTop: 14,
    // padding: 16,
    paddingHorizontal: width < 600 ? 16 : width > 980 ? 25 : 20,
    paddingVertical: width < 600 ? 14 : width > 980 ? 23 : 18,
    backgroundColor: "#eeeeee",
    width: "auto",
  },
  // Valve.js
  onOffStatus: (width) => ({
    flexDirection: width < 600 ? "column" : "row",
    justifyContent: width < 600 ? "flex-start" : "space-between",
    alignItems: width < 600 ? "center" : "center",
  }),
  /* ------------------------------------------- */
  // StatisticsTab.js
  statisticWrapper: {
    marginHorizontal: 14,
    marginTop: 14,
    padding: 14,
    backgroundColor: "#eeeeee",
    width: "auto",
  },
  // StatisticsTab.js
  statisticSectionContainer: (width) => ({
    flexDirection: width > 600 ? "row" : "column",
    flexWrap: width > 600 ? "wrap" : "nowrap",
    justifyContent: "space-between",
    alignItems: width > 600 ? "center" : "baseline",
    width: "auto",
    gap: width < 600 ? 10 : 14,
  }),
  // StatisticsTab.js
  statisticSection: (width) => ({
    // width: "100%",
    width:
      width < 600
        ? "100%"
        : width < 800
        ? width / 2.3
        : width < 950
        ? width / 2.3
        : width / 3.4,
  }),
  // StatisticsTab.js
  inputSettingsDisabled: (width) => ({
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 10,
    marginVertical: 2,
    borderWidth: 0.5,
    width: "100%",
    maxWidth: "100%",
    height: width < 600 ? 38 : width < 800 ? 36 : width < 950 ? 44 : 44,
    fontSize: width < 600 ? 14 : width < 800 ? 14 : width < 950 ? 18 : 20,
    color: "#000",
  }),
  // Statistics.js
  StatisticContainerBtnText: {
    marginTop: 14,
    width: "100%",
    maxWidth: "100%",
    height: width < 600 ? 34 : width < 800 ? 33 : width < 950 ? 40 : 40,
  },
  /* --------------------------------------- */
  // TestTab.js
  containerTestTab: {
    flex: 1,
    padding: 10,
  },
  // TestTab.js
  box: {
    flex: 1,
    marginBottom:
      Platform.OS === "android" ? marginBottomAndroid : marginBottomIOS,
  },
  // TestTab.js
  testTitle: (width) => ({
    fontSize: width < 600 ? 20 : width < 800 ? 20 : width < 950 ? 28 : 32,
    fontWeight: "bold",
  }),
  // TestTab.js
  inputTestContainer: (width) => ({
    flexDirection: "row",
    alignItems: "center",
    height: width < 600 ? 52 : width < 800 ? 48 : width < 950 ? 63 : 73,
    padding: 5,
    // backgroundColor: "#fff",
    marginBottom: 10,
  }),
  // TestTab.js
  testInput: (width) => ({
    height: "100%",
    fontSize: width < 600 ? 14 : width < 800 ? 14 : width < 950 ? 18 : 22,
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingLeft: 10,
  }),
  // TestTab.js
  btnSend: (width) => ({
    width: width < 600 ? 66 : width < 800 ? 85 : width < 950 ? 95 : 120,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
    height: "100%",
  }),
  // TestTab.js
  sendButtonText: (width) => ({
    color: "#fff",
    fontSize: width < 600 ? 14 : width < 800 ? 15 : width < 950 ? 18 : 24,
  }),
  // TestTab.js
  msgViewContainer: {
    marginVertical: 4,
    backgroundColor: "#f7f7f7",
    padding: width < 600 ? 4 : width < 800 ? 4 : width < 950 ? 8 : 8,
    flexDirection: "row",
    justifyContent: "space-between",
    textAlign: "center",
    flexWrap: "wrap",
  },
  // TestTab.js
  msgView: {
    justifyContent: "center",
  },
  // TestTab.js
  itemType: (width) => ({
    fontSize: width < 600 ? 14 : width < 800 ? 15 : width < 950 ? 20 : 22,
    fontWeight: "bold",
    color: "#7d7d7d",
  }),
  // TestTab.js
  itemData: (width) => ({
    fontSize: width < 600 ? 14 : width < 800 ? 16 : width < 950 ? 22 : 24,
    fontWeight: "bold",
  }),
  // TestTab.js
  itemDate: (width) => ({
    color: "#7d7d7d",
    fontSize: width < 600 ? 11 : width < 800 ? 14 : width < 950 ? 18 : 22,
  }),
  // TestTab.js
  emptyContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  // TestTab.js
  emptyText: (width) => ({
    fontSize: width < 600 ? 16 : width < 800 ? 16 : width < 950 ? 26 : 30,
    fontWeight: "bold",
    color: "#0055a4",
  }),
  // TestTab.js
  emptyImg: (width) => ({
    width:
      width < 600
        ? width / 2
        : width < 800
        ? width / 3
        : width < 950
        ? width / 3
        : width / 4,
    height:
      width < 600
        ? width / 2
        : width < 800
        ? width / 3
        : width < 950
        ? width / 3
        : width / 4,
  }),

  // TestTab.js
  flatListContainer: {
    padding: 10, // Make space for input area
    backgroundColor: "#fff",
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  // TestTab.js
  emptyPINContainer: { justifyContent: "center", alignItems: "center" },
  // TestTab.js
  emptyPINText: {
    fontSize: width < 600 ? 22 : width > 950 ? 30 : 26,
    fontWeight: "bold",
    color: "#0055a4",
  },
  /* ----------------------------- */
  // Home.js
  HomeView: {
    flex: 1,
    backgroundColor: "#eeeeee",
    padding: 12,
  },
  // Home.js
  HomeBtnSendText: (width) => ({
    paddingHorizontal: 12,
    height: width < 600 ? 38 : width < 800 ? 35 : width < 950 ? 50 : 50,
    maxHeight: 90,
    width: "100%",
  }),
  // Home.js
  HomeTextSendStyle: (width) => ({
    fontSize: width < 600 ? 15 : width < 800 ? 14 : width < 950 ? 20 : 20,
    padding: 4,
  }),
  // Home.js
  HomeTitle: (width) => ({
    fontSize: width < 600 ? 20 : width < 800 ? 18 : width < 950 ? 26 : 26,
    fontWeight: "bold",
    marginBottom: 10,
  }),
  // Home.js
  HomeCountDevices: (width) => ({
    fontSize: width < 600 ? 13 : width < 800 ? 12 : width < 950 ? 20 : 20,
  }),
  // Home.js
  emptyTextHome: (width) => ({
    fontSize: width < 600 ? 16 : width < 800 ? 14 : width < 950 ? 22 : 22,
    fontStyle: "italic",
    fontWeight: "bold",
    color: "#b5b5b5",
  }),

  /* ----------------------------------- */
  // Item.js
  itemView: {
    backgroundColor: "#fff",
    margin: 2,
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    alignItems: "center",
  },
  // Item.js
  itemInfo: {
    flex: 1,
  },
  // Item.js
  itemName: (width) => ({
    fontSize: width < 600 ? 18 : width < 800 ? 18 : width < 950 ? 26 : 26,
    fontWeight: "bold",
  }),
  // Item.js
  itemID: (width) => ({
    fontSize: width < 600 ? 10 : width < 800 ? 10 : width < 950 ? 14 : 14,
    color: "#9E9E9E",
  }),
  /* --------------------------- */
  // Tab.js
  tab: (width) => ({
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: width < 600 ? 12 : width < 800 ? 8 : width < 950 ? 14 : 14,
    borderBottomWidth: 4,
    borderBottomColor: "transparent",
    backgroundColor: "#0055a4",
  }),
  // Tab.js
  activeTab: {
    borderBottomColor: "#d7c300", // Active tab indicator color
    backgroundColor: "#0a4b87",
  },
  // Tab.js
  tabText: (width) => ({
    fontSize: width < 600 ? 13 : width < 800 ? 14 : width < 950 ? 18 : 22,
    fontWeight: "bold",
    color: "#fff", // Customize tab label color
  }),
  /* ----------------------------- */
  // PIN_modal.js
  PINContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  // PIN_modal.js
  PINContent: (width) => ({
    width:
      width < 600 ? "80%" : width < 800 ? "70%" : width < 950 ? "75%" : "70%",
    padding: 24,
    backgroundColor: "white",
    alignItems: "center",
    position: "relative",
  }),
  // PIN_modal.js
  closeIconContainer: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  // PIN_modal.js
  PINTitle: (width) => ({
    fontSize: width < 600 ? 20 : width < 800 ? 22 : width < 950 ? 28 : 30,
    fontWeight: "bold",
    marginBottom: 24,
  }),
  // PIN_modal.js
  PINinput: (width) => ({
    borderColor: "#0055a4",
    paddingHorizontal: 8,
    marginBottom: 14,
    borderWidth: 1,
    width: "100%",
    maxWidth: "100%",
    height: width < 600 ? 40 : width < 800 ? 38 : width < 950 ? 44 : 44,
    fontSize: width < 600 ? 14 : width < 800 ? 14 : width < 950 ? 22 : 24,
  }),
  /* ---------------------------- */
  // TabView.js
  deviceBloc: {
    marginHorizontal: 14,
    marginVertical: 10,
  },
  // TabView.js
  nameVersionBloc: (width) => ({
    flexDirection: width < 600 ? "column" : "row",
    alignItems: "center",
    justifyContent: "space-between",
  }),
  // TabView.js
  version: (width) => ({
    color: "#000",
    fontWeight: "bold",
    fontSize: width < 600 ? 14 : width < 800 ? 15 : width < 950 ? 22 : 24,
    // textAlign: "center",
    // marginBottom: 2,
  }),
  // TabView.js
  wellName: (width) => ({
    color: "#000",
    fontWeight: "bold",
    fontSize: width < 600 ? 14 : width < 800 ? 15 : width < 950 ? 22 : 24,
    // textAlign: "center",
    marginBottom: 2,
  }),
  // TabView.js
  deviceInfo: (width) => ({
    fontSize: width < 600 ? 12 : width < 800 ? 14 : width < 950 ? 18 : 22,
    color: "#7d7d7d",
  }),
  // TabView.js
  deviceBtns: {
    // paddingHorizontal: 12,
    marginHorizontal: 0,
    // marginTop: 6,
  },
  // TabView.js
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc", // Customize tab bar border color
  },
  // TabView.js
  contentContainer: {
    flex: 1,
  },
  /* -------------------------------- */
  // ButtonUI.js
  buttonStyle: {
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
    backgroundColor: "#0055a4",
  },
  // ButtonUI.js
  buttonTextStyle: {
    color: "#fff",
    fontSize: width < 600 ? 16 : width < 800 ? 16 : width < 950 ? 20 : 22,
    // padding: 4,
  },
  /* ------------------------------- */
  // Laoding.js
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent background
  },
  // Laoding.js
  modalContent: {
    backgroundColor: "white",
    padding: 34,
    alignItems: "center",
  },
  // Laoding.js
  waitingMsg: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  /* -------------------------------- */
  // Dropdown.js
  dropdownButtonStyle: {
    backgroundColor: "#fff",
    borderWidth: 0.5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    width: "100%",
    maxWidth: "100%",
    height: width < 600 ? 38 : width < 800 ? 34 : width < 950 ? 44 : 44,
    marginVertical: 2,
  },
  // Dropdown.js
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: width < 600 ? 14 : width < 800 ? 14 : width < 950 ? 18 : 20,
  },
  // Dropdown.js
  dropdownButtonArrowStyle: {
    fontSize: width < 600 ? 18 : width < 800 ? 18 : width < 950 ? 20 : 22,
  },
  // Dropdown.js
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 14,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  // Dropdown.js
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: width < 600 ? 14 : width < 800 ? 14 : width < 950 ? 18 : 20,
    fontWeight: "500",
    color: "#151E26",
  },
  // Dropdown.js
  dropdownMenuStyle: {
    backgroundColor: "#eeeeee",
  },
  /* -------------------------------- */
  // Login_modal.js
  loginContainer: (width) => ({
    width:
      width < 600 ? "90%" : width < 800 ? "70%" : width < 950 ? "75%" : "70%",
    // height: "60%",
    padding: 20,
    backgroundColor: "white",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 8,
    position: "relative",
  }),
  // Login_modal.js
  loginImgDefault: (width) => ({
    height: width < 600 ? 100 : width < 800 ? 150 : width < 950 ? 350 : 350,
    width: width < 600 ? 100 : width < 800 ? 150 : width < 950 ? 350 : 350,
  }),
  // Login_modal.js
  loginImgLoad: (width) => ({
    height: width < 600 ? 100 : width < 800 ? 150 : width < 950 ? 350 : 350,
    width: width < 600 ? 100 : width < 800 ? 150 : width < 950 ? 350 : 350,
  }),
  // Login_modal.js
  otpTitle: (width) => ({
    fontSize: width < 600 ? 20 : width < 800 ? 20 : width < 950 ? 26 : 30,
    color: "#0055a4",
    fontWeight: "bold",
  }),
  // Login_modal.js
  PINinputLogin: (width) => ({
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    marginBottom: 6,
    borderWidth: 0.5,
    width: "100%",
    maxWidth: "100%",
    height: width < 600 ? 35 : width < 800 ? 35 : width < 950 ? 42 : 42,
    fontSize: width < 600 ? 16 : width < 800 ? 16 : width < 950 ? 22 : 24,
  }),
  // Login_modal.js
  // loginContainerStyle: (width) => ({
  //   padding: 4,
  //   marginHorizontal: 2,
  //   gap: width < 600 ? 1 : width < 800 ? 4 : width < 950 ? 8 : 10,
  // }),
  // // Login_modal.js
  // loginTextInputStyle: (width) => ({
  //   backgroundColor: "#fff",
  //   borderWidth: 2,
  //   borderBottomWidth: 2,
  //   marginHorizontal: 3,
  //   borderRadius: 10,
  //   height: width < 600 ? 45 : width < 800 ? 50 : width < 950 ? 70 : 70,
  //   width: width < 600 ? 45 : width < 800 ? 50 : width < 950 ? 70 : 70,
  // }),
  // Login_modal.js
  forgotBloc: { flexDirection: "row", gap: 4 },
  // Login_modal.js
  forgotTxt: (width) => ({
    fontWeight: "bold",
    fontSize: width < 600 ? 14 : width < 800 ? 14 : width < 950 ? 20 : 26,
  }),
  // // Login_modal.js
  // btnCloseLogin: (width) => ({
  //   paddingHorizontal: 12,
  //   height: width < 600 ? 36 : width < 800 ? 33 : width < 950 ? 42 : 42,
  //   maxHeight: 90,
  //   width: "100%",
  //   backgroundColor: "white",
  //   borderColor: "#0055a4",
  //   borderWidth: 1,
  // }),
  // // Login_modal.js
  // TextCloseLogin: (width) => ({
  //   fontSize: width < 600 ? 14 : width < 800 ? 14 : width < 950 ? 20 : 22,
  //   paddingHorizontal: 12,
  //   color: "#0055a4",
  // }),
  // Login_modal.js
  // loadingStyle: {
  //   marginTop: 20,
  // },
};
