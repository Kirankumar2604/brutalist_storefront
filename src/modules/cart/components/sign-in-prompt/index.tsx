import { Button, Heading, Text } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SignInPrompt = () => {
  return (
    <div className="bg-[var(--brut-paper)] flex flex-col small:flex-row small:items-center small:justify-between gap-3 small:gap-4 border-2 border-black p-3 small:p-4">
      <div>
        <Heading level="h2" className="txt-base small:txt-xlarge [font-family:var(--font-display)]">
          Already have an account?
        </Heading>
        <Text className="txt-small small:txt-medium text-ui-fg-subtle mt-2 uppercase tracking-[0.06em]">
          Sign in for a better experience.
        </Text>
      </div>
      <div className="flex-shrink-0">
        <LocalizedClientLink href="/account">
          <Button variant="secondary" className="h-9 small:h-10" data-testid="sign-in-button">
            Sign in
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default SignInPrompt
