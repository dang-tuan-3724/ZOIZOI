import { View, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import React, { useState } from "react";
import CustomTextBold from "@/components/CustomTextBold";
import CustomTextMedium from "@/components/CustomTextMedium";
import { Modal } from "@/components/Modal";
import RNPickerSelect from "react-native-picker-select";
import device from "@/api/addDevice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const AddDevice = () => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [deviceName, setDeviceName] = useState("");
  const [deviceType, setDeviceType] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  const deviceTypeOptions = [
    { label: "Máy bơm", value: "pump" },
    { label: "Đèn", value: "light" },
    { label: "Cảm biến ánh sáng", value: "Light Sensor" },
    { label: "Cảm biến nhiệt độ", value: "Temperature Sensor" },
    { label: "Cảm biến độ ẩm đất", value: "Soil Moisture Sensor" },
    { label: "Cảm biến độ ẩm không khí", value: "Humidity Sensor" },
  ];

  const sensorValueMap: Record<string, number> = {
    "Light Sensor": 10,
    "Temperature Sensor": 30.5,
    "Soil Moisture Sensor": 70,
    "Humidity Sensor": 70,
  };

  const handleAddDevice = async () => {
    const token = await AsyncStorage.getItem("AccessToken");
    if (!deviceType || !deviceName.trim()) {
      Alert.alert("Vui lòng nhập đầy đủ tên và chọn loại thiết bị.");
      return;
    }
    if (!token) return;

    if (deviceType === "pump") {
      device.addPump(token, deviceName).then(handleSuccess).catch(handleError);
    } else if (deviceType === "light") {
      device.addLight(token, deviceName).then(handleSuccess).catch(handleError);
    } else {
      let alertThreshold = sensorValueMap[deviceType];
      device
        .addSensor(token, deviceName, deviceType, alertThreshold)
        .then(handleSuccess)
        .catch(handleError);
    } 
  };

  const handleSuccess = (response: any) => {
    setMsg(response.message);
    setModalVisible(true);
    setTimeout(() => {
      setModalVisible(false);
      setDeviceName("");
      setMsg("");
      setDeviceType(null);
    }, 2000);
  };

  const handleError = (error: any) => {
    if (error.response?.status === 401) {
      Alert.alert("Error", error.response.data?.error, [{ text: "OK" }]);
      router.replace("/login");
    } else {
      console.error("Unexpected error:", error);
      Alert.alert("Lỗi", "Không thể thêm thiết bị.");
    }
  };

  return (
    <View className="p-5">
      <CustomTextBold className="text-[20px] mb-4">
        Thêm thiết bị mới
      </CustomTextBold>
      <View
        style={{
          borderRadius: 30,
          height: 70,
          borderWidth: 2,
          paddingTop: 15,
          borderColor: "#ccc",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <RNPickerSelect
          placeholder={{ label: "Chọn loại thiết bị", value: null }}
          items={deviceTypeOptions}
          value={deviceType}
          onValueChange={setDeviceType}
          style={{
            inputAndroid: {
              paddingVertical: 8,
              paddingHorizontal: 12,
              textAlign: "center",
              color: "#000",
              backgroundColor: "transparent",
              marginBottom: 26,
              overflow: "hidden",
            },
          }}
        />
      </View>
      <TextInput
        placeholder="Nhập tên thiết bị"
        placeholderTextColor="#978CEA"
        value={deviceName}
        onChangeText={setDeviceName}
        style={{
          borderRadius: 50,
          backgroundColor: "#0400FF",
          padding: 10,
          height: 60,
          fontFamily: "Quicksand-Medium",
          color: "#ffffff",
          marginBottom: 20,
        }}
      />

      <TouchableOpacity
        className="flex-row items-center justify-center mt-4"
        style={{
          borderWidth: 2,
          paddingVertical: 10,
          borderRadius: 50,
          borderColor: "#0400FF",
          backgroundColor: "#fff",
          marginLeft: 200,
        }}
        onPress={handleAddDevice}
      >
        <CustomTextBold style={{ color: "black", fontSize: 16 }}>
          Thêm thiết bị
        </CustomTextBold>
        <Image
          source={require("@/assets/icons/arrow_icon.png")}
          className="w-10 h-10 ml-2"
        />
      </TouchableOpacity>

      {/* Modal kết quả */}
      <Modal isOpen={modalVisible} withInput={false}>
        <View className="bg-[#FFFFFF] w-full p-4 gap-4 rounded-[30px] items-center justify-center border border-[#448AFD] mx-5">
          <Image source={require("@/assets/icons/success_icon.png")} />
          <CustomTextBold>{msg}</CustomTextBold>
          <CustomTextMedium>Tên: {deviceName}</CustomTextMedium>
        </View>
      </Modal>
    </View>
  );
};

export default AddDevice;
