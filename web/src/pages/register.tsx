import React from "react";
import { Formik, Form } from "formik";
import { Box, Button } from "@chakra-ui/core";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useRegisterMutation, MeQuery, MeDocument } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { withApollo } from "../utils/withApollo";
import useLocalStorage from "../utils/useLocalStorage";
import { Video } from "../interfaces/index";

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter();
  const [videoFromLocalStorage] = useLocalStorage("data", []);
  const videosId = videoFromLocalStorage?.map((video: Video) => video.id);
  const [register] = useRegisterMutation();
  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="stretch"
      alignContent="stretch"
    >
      <Box
        backgroundColor="#fff"
        borderBottom="1px solid #e8e8e8"
        fontSize="16px"
        display="flex"
        flex="0 0 auto"
        flexDirection="row"
        padding="10px 15px 12px 15px"
      >
        <Box>
          <NextLink href="/">
            <Box fontSize="20px" fontWeight={900} color="#2c2c2c">
              Streamario
            </Box>
          </NextLink>
        </Box>
      </Box>

      <Box
        bg="#f1f1f1"
        height="100%"
        padding="10px"
        width="100%"
        flex="1 1"
        display="flex"
        flexDirection="column"
      >
        <Box textAlign="left" width="280px" margin="auto">
          <Formik
            initialValues={{ email: "", username: "", password: "" }}
            onSubmit={async (values, { setErrors }) => {
              const response = await register({
                variables: { options: { ...values, videosId } },
                update: (cache, { data }) => {
                  cache.writeQuery<MeQuery>({
                    query: MeDocument,
                    data: {
                      __typename: "Query",
                      me: data?.register.user,
                    },
                  });
                },
              });
              if (response.data?.register.errors) {
                setErrors(toErrorMap(response.data.register.errors));
              } else if (response.data?.register.user) {
                // worked
                router.push("/");
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <InputField
                  name="username"
                  placeholder="username"
                  label="Username"
                />
                <Box mt={4}>
                  <InputField
                    name="email"
                    placeholder="Email address"
                    label="Email"
                  />
                </Box>
                <Box mt={4}>
                  <InputField
                    name="password"
                    placeholder="Password"
                    label="Password"
                    type="password"
                  />
                </Box>
                <Button
                  mt={4}
                  type="submit"
                  width="100%"
                  isLoading={isSubmitting}
                  variantColor="teal"
                >
                  Sign up
                </Button>
              </Form>
            )}
          </Formik>
          <Box display="flex" flexDirection="row" marginTop="30px">
            Already have an account?{" "}
            <Box fontWeight={600} marginLeft="10px" color="#0f90fa">
              <NextLink href="/login"> Log In</NextLink>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default withApollo({ ssr: false })(Register);
