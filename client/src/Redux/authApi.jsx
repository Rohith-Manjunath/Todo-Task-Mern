import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const devUrl = `${import.meta.env.VITE_BACKEND_URL}/api/`;

export const myApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: devUrl,
  }),
  tagTypes: ["Tasks"],
  endpoints: (builder) => ({
    getTasks: builder.query({
      query: () => ({
        url: "tasks",
        method: "GET",
      }),
      providesTags: ["Tasks"],
    }),
    deleteTask: builder.mutation({
      query: ({ id }) => ({
        url: `tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks"],
    }),
    isTaskCompleted: builder.mutation({
      query: ({ id }) => ({
        url: `task/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Tasks"],
    }),
    createTask: builder.mutation({
      query: (data) => ({
        url: `tasks`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Tasks"],
    }),
    getSingleTask: builder.query({
      query: ({ id }) => ({
        url: `tasks/${id}`,
        method: "GET",
      }),
      // invalidatesTags: ["Tasks"],
    }),
    updateTask: builder.mutation({
      query: ({ data, id }) => ({
        url: `tasks/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Tasks"],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useDeleteTaskMutation,
  useIsTaskCompletedMutation,
  useCreateTaskMutation,
  useGetSingleTaskQuery,
  useUpdateTaskMutation,
} = myApi;
