import { router, useLocalSearchParams, Redirect } from "expo-router";
import { Alert, Modal, ScrollView, StatusBar, View } from "react-native";
import { api } from "../services/api";
import { useEffect, useRef, useState } from "react";
import { Loading } from "../components/loading";
import { Cover } from "../components/market/cover";
import { Details, PropsDetails } from "../components/market/details";
import { Coupon } from "../components/market/coupon";
import { Button } from "../components/button";
import { CameraView, useCameraPermissions } from "expo-camera";

type MarketProp = PropsDetails & {
  cover: string;
}

export default function Market() {
  const params = useLocalSearchParams<{ id: string }>();
  const [market, setMarket] = useState<MarketProp>();
  const [coupon, setCoupon] = useState<string | null>(null);
  const [couponIsFetching, setCouponIsFetching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisibleCameraModal, setIsVisibleCameraModal] = useState(false);
  const qrLock = useRef(false);

  const [_, requestPermission] = useCameraPermissions();

  async function fetchMarket() {
    try {
      const { data } = await api.get(`/markets/${params.id}`);

      setMarket(data);

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível carregar os dados", [
        { text: "OK", onPress: () => router.back() },
      ]);
    }
  };

  async function handleOpenCamera() {
    try {
      const { granted } = await requestPermission();

      if (!granted) {
        return Alert.alert("Câmera", "Você precisa habilitar o uso da câmera");
      }

      qrLock.current = false;

      setIsVisibleCameraModal(true);
    } catch (error) {
      console.log(error)
      Alert.alert("Câmera", "Não foi possível utilizar a câmera");
    }
  }

  async function getCoupon(id: string) {
    try {
      setCouponIsFetching(true);

      const { data } = await api.patch("/coupons/" + id);

      setCoupon(data.coupon);

      Alert.alert("Cupom", data.coupon);
    } catch (error) {
      console.log(error)
      Alert.alert("Erro", "Não foi possível utilizar o cupom");
    } finally {
      setCouponIsFetching(false);
    }
  }

  function handleUseCoupon(id: string) {
    setIsVisibleCameraModal(false);

    Alert.alert(
      "Cupom",
      "Não é possível reutilizar um cupom resgatado. Deseja realmente resgatar o cupom?",
      [
        { style: "cancel", text: "Não" },
        { text: "Sim", onPress: () => getCoupon(id) },
      ]
    );
  }

  useEffect(() => {
    fetchMarket();
  }, [params.id, coupon]);

  if (isLoading) return <Loading />;

  if (!market) return <Redirect href="/home" />;

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" hidden={isVisibleCameraModal} />

      <ScrollView showsHorizontalScrollIndicator={false}>
        <Cover uri={market.cover} />
        <Details data={market} />
        {coupon && <Coupon code={coupon} />}
      </ScrollView>

      <View style={{ padding: 32 }}>
        <Button onPress={handleOpenCamera}>
          <Button.Title>Ler QR Code</Button.Title>
        </Button>
      </View>

      <Modal style={{ flex: 1 }} visible={isVisibleCameraModal}>
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          onBarcodeScanned={({ data }) => {
            if (data && !qrLock.current) {
              qrLock.current = true;

              setTimeout(() => handleUseCoupon(data), 500);
            }
          }}
        />

        <View style={{ position: "absolute", bottom: 32, left: 32, right: 32 }}>
          <Button
            onPress={() => setIsVisibleCameraModal(false)}
            isLoading={couponIsFetching}
          >
            <Button.Title>Voltar</Button.Title>
          </Button>
        </View>
      </Modal>
    </View>
  );
};