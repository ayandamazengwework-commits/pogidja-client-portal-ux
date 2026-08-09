import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'

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
        Welcome to the POG ADVISORY AND CHARTERED ACCOUNTANTS INC. Client Portal
      </Preview>

      <Body
        style={{
          background: '#f5f7fb',
          fontFamily: 'Arial, Helvetica, sans-serif',
          margin: 0,
          padding: '40px 0',
        }}
      >
        <Container
          style={{
            background: '#ffffff',
            margin: '0 auto',
            padding: '40px',
            borderRadius: '16px',
            maxWidth: '640px',
            border: '1px solid #e2e8f0',
          }}
        >
          {/* HEADER */}

          <Section
            style={{
              background: '#0f2747',
              padding: '28px',
              borderRadius: '12px',
              textAlign: 'center',
              marginBottom: '32px',
            }}
          >
            <Heading
              style={{
                color: '#ffffff',
                fontSize: '21px',
                lineHeight: '1.3',
                margin: 0,
                fontWeight: '700',
              }}
            >
              POG ADVISORY
            </Heading>

            <Text
              style={{
                color: '#cbd5e1',
                fontSize: '13px',
                margin: '8px 0 0',
                lineHeight: '1.5',
              }}
            >
              AND CHARTERED ACCOUNTANTS INC.
            </Text>

            <Text
              style={{
                color: '#cbd5e1',
                fontSize: '13px',
                margin: '8px 0 0',
                lineHeight: '1.5',
              }}
            >
              Secure Client Portal
            </Text>
          </Section>

          {/* CONTENT */}

          <Heading
            style={{
              color: '#0f172a',
              fontSize: '24px',
              lineHeight: '1.3',
              margin: '0 0 18px',
            }}
          >
            Welcome {name}
          </Heading>

          <Text
            style={{
              color: '#475569',
              fontSize: '15px',
              lineHeight: '1.7',
              margin: '0 0 16px',
            }}
          >
            Your client portal account has been created
            successfully with POG ADVISORY AND CHARTERED
            ACCOUNTANTS INC.
          </Text>

          <Text
            style={{
              color: '#475569',
              fontSize: '15px',
              lineHeight: '1.7',
              margin: '0 0 24px',
            }}
          >
            Your secure client portal gives you one place
            to communicate with your advisor, submit
            documents, track your services and receive
            important updates.
          </Text>

          {/* FEATURES */}

          <Section
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '20px',
              margin: '24px 0',
            }}
          >
            <Text
              style={{
                color: '#0f2747',
                fontSize: '15px',
                fontWeight: '700',
                margin: '0 0 14px',
              }}
            >
              Inside your portal you can:
            </Text>

            <Text
              style={{
                color: '#475569',
                fontSize: '14px',
                lineHeight: '1.9',
                margin: 0,
              }}
            >
              ✓ Submit service requests
              <br />
              ✓ Upload requested documents
              <br />
              ✓ Track your service progress
              <br />
              ✓ Receive important notifications
              <br />
              ✓ View invoices and payment information
              <br />
              ✓ Communicate securely with your advisor
              <br />
              ✓ Download completed files
            </Text>
          </Section>

          {/* BUTTON */}

          <Section
            style={{
              textAlign: 'center',
              marginTop: '32px',
              marginBottom: '32px',
            }}
          >
            <Button
              href={`${process.env.NEXT_PUBLIC_SITE_URL}/auth/login`}
              style={{
                background: '#1E88E5',
                color: '#ffffff',
                padding: '14px 30px',
                borderRadius: '10px',
                textDecoration: 'none',
                fontSize: '15px',
                fontWeight: '700',
              }}
            >
              Access My Client Portal
            </Button>
          </Section>

          {/* SECURITY NOTICE */}

          <Section
            style={{
              background: '#eff6ff',
              borderLeft: '4px solid #1E88E5',
              borderRadius: '8px',
              padding: '16px',
              marginTop: '28px',
            }}
          >
            <Text
              style={{
                color: '#334155',
                fontSize: '13px',
                lineHeight: '1.6',
                margin: 0,
              }}
            >
              For your security, please keep your portal
              login details confidential and do not share
              your password with anyone.
            </Text>
          </Section>

          {/* SUPPORT */}

          <Text
            style={{
              marginTop: '32px',
              color: '#64748b',
              fontSize: '14px',
              lineHeight: '1.7',
            }}
          >
            Need assistance?
            <br />
            <strong>POG@pogidja.co.za</strong>
            <br />
            <br />
            Visit our website:
            <br />
            <a
              href="https://pogidja.co.za"
              style={{
                color: '#1E88E5',
                textDecoration: 'none',
              }}
            >
              pogidja.co.za
            </a>
          </Text>

          {/* SIGN OFF */}

          <Text
            style={{
              marginTop: '30px',
              color: '#64748b',
              fontSize: '14px',
              lineHeight: '1.7',
            }}
          >
            Kind regards,
            <br />
            <strong style={{ color: '#0f2747' }}>
              POG ADVISORY AND CHARTERED ACCOUNTANTS INC.
            </strong>
          </Text>

          {/* FOOTER */}

          <Section
            style={{
              marginTop: '32px',
              paddingTop: '20px',
              borderTop: '1px solid #e2e8f0',
              textAlign: 'center',
            }}
          >
            <Text
              style={{
                color: '#94a3b8',
                fontSize: '12px',
                lineHeight: '1.6',
                margin: 0,
              }}
            >
              This email was sent by POG ADVISORY AND
              CHARTERED ACCOUNTANTS INC.
              <br />
              Please do not reply directly to this automated email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
