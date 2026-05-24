import {
  useEffect,
  useState,
} from "react";

import API
  from "@/services/api";

import {
  successToast,
  errorToast,
} from "@/services/toastService";

export function useJournal() {

  const [loading,
    setLoading] =
    useState(true);

  const [journals,
    setJournals] =
    useState([]);

  const [formData,
    setFormData] =
    useState({

      title: "",

      content: "",
    });

  /* Input */
  const handleChange =
    (e) => {

      setFormData({

        ...formData,

        [e.target.name]:
          e.target.value,
      });
    };

  /* Fetch Journals */
  const fetchJournals =
    async () => {

      try {

        setLoading(true);

        const response =
          await API.get(
            "/journal"
          );

        setJournals(
          response.data || []
        );

      } catch (error) {

        console.error(
          error
        );

        errorToast(
          "Failed to load journals"
        );

      } finally {

        setLoading(false);
      }
    };

  /* Create Journal */
  const createJournal =
    async () => {

      try {

        if (
          !formData.title ||
          !formData.content
        ) {

          return errorToast(
            "Fill all fields"
          );
        }

        const response =
          await API.post(
            "/journal",
            formData
          );

        setJournals((prev) => [

          response.data,

          ...prev,
        ]);

        successToast(
          "Journal created"
        );

        setFormData({

          title: "",

          content: "",
        });

      } catch (error) {

        console.error(
          error
        );

        errorToast(
          "Failed to create journal"
        );
      }
    };

  useEffect(() => {

    fetchJournals();

  }, []);

  return {

    loading,

    journals,

    formData,

    setFormData,

    handleChange,

    createJournal,

    fetchJournals,
  };
}