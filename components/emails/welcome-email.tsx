import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components"

interface WelcomeEmailProps {
  name: string
}

export default function WelcomeEmail({
  name,
}: WelcomeEmailProps) {
  return (
    <Html>

      <Head />

      <Preview>
        Welcome to the POG Advisory Client Portal
      </Preview>

      <Body
        style={{
          background: "#f5f7fb",
          fontFamily: "Arial",
        }}
      >

        <Container
          style={{
            background: "#ffffff",
            margin: "40px auto",
            padding: "40px",
            borderRadius: "16px",
            maxWidth: "640px",
          }}
        >

          <Img
            src="https://YOURDOMAIN.co.za/logo.png"
            width="220"
            alt="POG Advisory"
          />

          <Heading>
            Welcome to POG Advisory
          </Heading>

          <Text>
            Hi {name},
          </Text>

          <Text>
            Your client portal account has been created successfully.
          </Text>

          <Text>

            ✓ Submit service requests

            <br />

            ✓ Upload documents

            <br />

            ✓ Track progress

            <br />

            ✓ Receive notifications

            <br />

            ✓ Download completed files

          </Text>

          <Section
            style={{
              textAlign: "center",
              marginTop: "40px",
            }}
          >

            <Button
              href="https://portal.pogidja.co.za/auth/login"
              style={{
                background: "#1E88E5",
                color: "#fff",
                padding: "14px 30px",
                borderRadius: "10px",
                textDecoration: "none",
              }}
            >

              Access My Account

            </Button>

          </Section>

          <Text
            style={{
              marginTop: "40px",
              color: "#666",
            }}
          >
            Need assistance?

            <br />

            POG@pogidja.co.za

            <br />

            https://pogidja.co.za
          </Text>

        </Container>

      </Body>

    </Html>
  )
}
