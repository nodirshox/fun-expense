import { Shadows } from "@/constants/theme";
import { Wallet } from "@/types/wallet";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";

interface WalletSelectorProps {
  wallets: Wallet[];
  selectedWallet?: Wallet;
  onSelect: (walletId: string) => void;
  onDelete: (walletId: string) => void;
}

export const WalletSelector: React.FC<WalletSelectorProps> = ({
  wallets,
  selectedWallet,
  onSelect,
  onDelete,
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = (walletId: string) => {
    if (wallets.length <= 1) {
      Alert.alert("Error", "Cannot delete the last wallet");
      return;
    }

    Alert.alert(
      "Delete Wallet",
      "Are you sure you want to delete this wallet? All transactions will be lost.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDelete(walletId),
        },
      ]
    );
  };

  return (
    <>
      <TouchableOpacity
        style={styles.selectorButton}
        onPress={() => setIsOpen(true)}
      >
        <View style={styles.selectedWalletContainer}>
          <Text style={styles.walletEmoji}>
            {selectedWallet?.emoji || "💳"}
          </Text>
          <Text style={styles.walletName}>
            {selectedWallet?.name || "Select Wallet"}
          </Text>
        </View>
        <Text style={styles.chevron}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View
            style={styles.modalContent}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Wallet</Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.walletList}>
              {wallets.map((wallet) => (
                <View key={wallet.id} style={styles.walletItemContainer}>
                  <TouchableOpacity
                    style={[
                      styles.walletItem,
                      selectedWallet?.id === wallet.id &&
                        styles.selectedWalletItem,
                    ]}
                    onPress={() => {
                      onSelect(wallet.id);
                      setIsOpen(false);
                    }}
                  >
                    <View style={styles.walletInfo}>
                      <Text style={styles.walletEmoji}>{wallet.emoji}</Text>
                      <Text style={styles.walletItemName}>{wallet.name}</Text>
                      <Text style={styles.walletCurrency}>
                        ({wallet.currency})
                      </Text>
                    </View>
                  </TouchableOpacity>
                  {wallets.length > 1 && (
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDelete(wallet.id)}
                    >
                      <Text style={styles.deleteButtonText}>🗑️</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}

              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  setIsOpen(false);
                  router.push('/profile/create-wallet');
                }}
              >
                <Text style={styles.addButtonText}>+ Add New Wallet</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  selectorButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    ...Shadows.card,
  },
  selectedWalletContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  walletEmoji: {
    fontSize: 24,
  },
  walletName: {
    fontSize: 16,
    fontFamily: "Nunito-SemiBold",
    color: "#2D2D2D",
  },
  chevron: {
    fontSize: 12,
    color: "#999",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "80%",
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "Nunito-Bold",
    color: "#2D2D2D",
  },
  closeButton: {
    fontSize: 24,
    color: "#999",
  },
  walletList: {
    padding: 16,
  },
  walletItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  walletItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedWalletItem: {
    backgroundColor: "#E8F8F6",
    borderColor: "#52C5B6",
  },
  walletInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  walletItemName: {
    fontSize: 16,
    fontFamily: "Nunito-SemiBold",
    color: "#2D2D2D",
  },
  walletCurrency: {
    fontSize: 14,
    fontFamily: "Nunito-Regular",
    color: "#999",
  },
  deleteButton: {
    marginLeft: 8,
    padding: 8,
  },
  deleteButtonText: {
    fontSize: 20,
  },
  addButton: {
    padding: 16,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontFamily: "Nunito-SemiBold",
    color: "#52C5B6",
  },
});
