import { create }
  from "zustand";

import API
  from "@/services/api";

export const useJournalStore =
  create((set, get) => ({

    journals: [],
    loading: true,

    formData: {
      symbol: "",
      strategy: "",
      emotion: "",
      pnl: "",
      notes: "",
    },

    setFormData:
      (data) =>
        set({
          formData: data,
        }),

    fetchJournals:
      async () => {

        try {

          const response =
            await API.get(
              "/journal"
            );

          set({
            journals:
              response.data,
            loading: false,
          });

        } catch (error) {

          console.log(error);

          set({
            loading: false,
          });
        }
      },

    createJournal:
      async () => {

        const {
          formData,
        } = get();

        try {

          await API.post(
            "/journal",
            {
              ...formData,

              pnl:
                Number(
                  formData.pnl
                ),
            }
          );

          set({
            formData: {
              symbol: "",
              strategy: "",
              emotion: "",
              pnl: "",
              notes: "",
            },
          });

          get().fetchJournals();

        } catch (error) {

          console.log(error);
        }
      },
  }));