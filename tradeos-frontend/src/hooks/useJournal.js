import { useEffect }
  from "react";

import {
  useJournalStore,
} from "@/store/journalStore";

export function useJournal() {

  const {
    journals,
    loading,
    formData,
    setFormData,
    fetchJournals,
    createJournal,
  } = useJournalStore();

  useEffect(() => {

    fetchJournals();

  }, []);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  return {
    journals,
    loading,
    formData,
    setFormData,
    handleChange,
    createJournal,
  };
}