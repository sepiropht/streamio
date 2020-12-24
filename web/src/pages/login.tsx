import React from "react";
import { Formik, Form } from "formik";
import { Box, Button, Link, Flex } from "@chakra-ui/react";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useLoginMutation, MeQuery, MeDocument } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from "next/link";
import { withApollo } from "../utils/withApollo";

const Login: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [login] = useLoginMutation();
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
              Streamio
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
            initialValues={{ usernameOrEmail: "", password: "" }}
            onSubmit={async (values, { setErrors }) => {
              const response = await login({
                variables: values,
                update: (cache, { data }) => {
                  cache.writeQuery<MeQuery>({
                    query: MeDocument,
                    data: {
                      __typename: "Query",
                      me: data?.login.user,
                    },
                  });
                  cache.evict({ fieldName: "posts:{}" });
                },
              });
              if (response.data?.login.errors) {
                setErrors(toErrorMap(response.data.login.errors));
              } else if (response.data?.login.user) {
                if (typeof router.query.next === "string") {
                  router.push(router.query.next);
                } else {
                  // worked
                  router.push("/");
                }
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <InputField
                  name="usernameOrEmail"
                  placeholder="username or email"
                  label="Username or Email"
                />
                <Box mt={4}>
                  <InputField
                    name="password"
                    placeholder="password"
                    label="Password"
                    type="password"
                  />
                </Box>

                <Button
                  mt={4}
                  type="submit"
                  isLoading={isSubmitting}
                  colorScheme="teal"
                  width="100%"
                >
                  login
                </Button>
              </Form>
            )}
          </Formik>
          <Flex marginTop="30px">
            <NextLink href="/forgot-password">
              <Link color="#0f90fa" font-weight={600}>
                Forgot your password?
              </Link>
            </NextLink>
          </Flex>
          <Box display="flex" flexDirection="row" marginTop="30px">
            Don't have an account?{" "}
            <Box fontWeight={600} marginLeft="10px" color="#0f90fa">
              <NextLink href="/register"> Sign up for free</NextLink>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default withApollo({ ssr: false })(Login);
