import AsyncStorage from "@react-native-async-storage/async-storage";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
const CACHE_PREFIX = "transactions_cache_";

async function getCachedTransactions(address: string) {
    const cached = await AsyncStorage.getItem(CACHE_PREFIX + address);
    return cached ? JSON.parse(cached) : [];
}

async function setCachedTransactions(address: string, transactions: any[]) {
    await AsyncStorage.setItem(CACHE_PREFIX + address, JSON.stringify(transactions));
}

async function getTransactions(address: PublicKey) {
    const response = await fetch(`/api/transactions?address=${address.toBase58()}`);
    const data = await response.json();
    return data.transactions;
}

export function useTransactions(address: PublicKey) {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);

        (async () => {
            const cached = await getCachedTransactions(address.toBase58());
            if (isMounted) setTransactions(cached);

            try {
                const fetched = await getTransactions(address);
                const isNew = !cached.length || fetched[0]?.signature !== cached[0]?.signature;
                if (isNew) {
                    await setCachedTransactions(address.toBase58(), fetched);
                    if (isMounted) setTransactions(fetched);
                }
            } catch (err: any) {
                if (isMounted) setError(err.message);
            } finally {
                if (isMounted) setLoading(false);
            }
        })();

        return () => {
            isMounted = false;
        };
    }, [address]);

    return { transactions, loading, error };
}