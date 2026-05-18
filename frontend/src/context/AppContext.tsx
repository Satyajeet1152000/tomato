import axios from "axios";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { authService, restaurantService } from "../main";
import type { AppContextType, ICart, LocationData, User } from "../types";
import toast, { Toaster } from "react-hot-toast";

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  const [location, setLocation] = useState<LocationData | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [city, setCity] = useState("Fecthing Location...");

  async function fetchUser() {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.get(`${authService}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(data);
      setIsAuth(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const [cart, setCart] = useState<ICart[]>([]);
  const [subTotal, setSubTotal] = useState(0);
  const [quauntity, setQuauntity] = useState(0);

  async function fetchCart() {
    if (!user || user.role !== "customer") return;
    try {
      const { data } = await axios.get(`${restaurantService}/api/cart/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setCart(data.cart || []);
      setSubTotal(data.subtotal || 0);
      setQuauntity(data.cartLength);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user && user.role === "customer") {
      fetchCart();
    }
  }, [user]);

  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Please allow location access to continue");
      return;
    }

    setLoadingLocation(true);

    const resolveAddress = async (latitude: number, longitude: number) => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          {
            headers: {
              Accept: "application/json",
              "Accept-Language": "en",
            },
          },
        );

        if (!res.ok) {
          throw new Error("Reverse geocoding failed");
        }

        const data = await res.json();

        setLocation({
          latitude,
          longitude,
          formattedAddress: data.display_name || "Current location",
        });

        setCity(
          data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            "Your Location",
        );
      } catch {
        setLocation({
          latitude,
          longitude,
          formattedAddress: "Current location",
        });
        setCity("Failed to load city");
      } finally {
        setLoadingLocation(false);
      }
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        void resolveAddress(latitude, longitude);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setLoadingLocation(false);
        setCity("Location unavailable");
        if (error.code === error.PERMISSION_DENIED) {
          toast.error(
            "Location permission denied. Allow location access in your browser settings.",
          );
        } else {
          toast.error("Unable to get your location. Please try again.");
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
    );
  }, []);

  return (
    <AppContext.Provider
      value={{
        isAuth,
        loading,
        setIsAuth,
        setLoading,
        setUser,
        user,
        location,
        loadingLocation,
        city,
        cart,
        fetchCart,
        quauntity,
        subTotal,
      }}
    >
      {children}

      <Toaster />
    </AppContext.Provider>
  );
};

export const useAppData = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppData must be used within AppProvider");
  }
  return context;
};
