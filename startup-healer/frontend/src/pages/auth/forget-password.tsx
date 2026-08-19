import { useState } from 'react'
import {
  Box, Button, Flex, FormControl, FormLabel, Heading, Input,
  Text, VStack, useToast, Icon, InputGroup, InputLeftElement,
  InputRightElement, FormErrorMessage, Image, IconButton, HStack, PinInput, PinInputField,
} from '@chakra-ui/react'
import { FiMail, FiLock, FiArrowLeft, FiEye, FiEyeOff } from 'react-icons/fi'
import { useRouter } from 'next/router'
import { apiClient } from '@/lib/api'

type Step = 'email' | 'otp' | 'password'

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const toast = useToast()
  const router = useRouter()

  // ─── Step 1: Send OTP ──────────────────────────────────────────────
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}
    if (!email) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format'
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setLoading(true)
    try {
      await apiClient.forgotPassword(email)
      toast({ title: 'OTP sent to your email', status: 'success', duration: 3000 })
      setStep('otp')
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to send OTP',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  // ─── Step 2: Verify OTP ────────────────────────────────────────────
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) {
      setErrors({ otp: 'Please enter the full 6-digit OTP' })
      return
    }
    setErrors({})
    setLoading(true)
    try {
      const data = await apiClient.verifyOtp(email, otp)
      setResetToken(data.resetToken)
      toast({ title: 'OTP verified!', status: 'success', duration: 2000 })
      setStep('password')
    } catch (err: any) {
      toast({
        title: 'Invalid OTP',
        description: err.response?.data?.message || 'Please try again',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  // ─── Step 3: Reset Password ────────────────────────────────────────
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}
    if (!newPassword) newErrors.newPassword = 'Password is required'
    else if (newPassword.length < 4) newErrors.newPassword = 'Password must be at least 4 characters'
    if (newPassword !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setLoading(true)
    try {
      await apiClient.resetPassword(resetToken, newPassword)
      toast({ title: 'Password reset successful!', description: 'You can now log in.', status: 'success', duration: 3000 })
      router.push('/auth/login')
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to reset password',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  const stepConfig = {
    email: { title: 'Forgot Password', subtitle: 'Enter your email to receive a password reset code' },
    otp: { title: 'Enter OTP', subtitle: `We sent a 6-digit code to ${email}` },
    password: { title: 'Set New Password', subtitle: 'Choose a strong new password for your account' },
  }

  return (
    <Flex minH="100vh" bg="#F7FAFC">
      {/* Left side - Branding (same as login) */}
      <Flex
        w="45%"
        display={{ base: 'none', lg: 'flex' }}
        bg="linear-gradient(135deg, #5FAF46 0%, #2E9E8E 50%, #1CA3D6 100%)"
        direction="column"
        justify="center"
        align="center"
        p={12}
        position="relative"
        overflow="hidden"
      >
        <Box position="relative" zIndex={1} textAlign="center">
          <Flex align="center" justify="center" gap={4} mb={8}>
            <Image src="/logo.png" alt="Startup Healer" h="80px" objectFit="contain" />
          </Flex>
          <Heading size="lg" color="white" mb={4} fontWeight="700">
            Reset Your Password
          </Heading>
          <Text color="whiteAlpha.800" fontSize="md" maxW="350px" mx="auto" lineHeight="1.7">
            Don&apos;t worry! It happens to the best of us. Enter your email and we&apos;ll send you a code to reset your password.
          </Text>
        </Box>
        {/* Decorative circles */}
        <Box position="absolute" top="-80px" right="-80px" w="250px" h="250px" borderRadius="full" bg="rgba(255,255,255,0.05)" />
        <Box position="absolute" bottom="-60px" left="-60px" w="200px" h="200px" borderRadius="full" bg="rgba(255,255,255,0.05)" />
      </Flex>

      {/* Right side - Form */}
      <Flex flex={1} align="center" justify="center" p={8}>
        <Box w="full" maxW="420px">
          {/* Back to login */}
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Icon as={FiArrowLeft} />}
            color="gray.500"
            mb={6}
            onClick={() => {
              if (step === 'email') router.push('/auth/login')
              else if (step === 'otp') setStep('email')
              else setStep('otp')
            }}
            _hover={{ color: 'teal.600' }}
          >
            {step === 'email' ? 'Back to Login' : 'Back'}
          </Button>

          <Box mb={8}>
            <Heading size="lg" color="navy.500" mb={2}>{stepConfig[step].title}</Heading>
            <Text color="gray.500">{stepConfig[step].subtitle}</Text>
          </Box>

          {/* Step progress indicator */}
          <HStack spacing={2} mb={6}>
            {(['email', 'otp', 'password'] as Step[]).map((s, i) => (
              <Box
                key={s}
                flex={1}
                h="4px"
                borderRadius="full"
                bg={
                  i <= ['email', 'otp', 'password'].indexOf(step)
                    ? 'teal.400'
                    : 'gray.200'
                }
                transition="background 0.3s"
              />
            ))}
          </HStack>

          {/* ─── Step 1: Email ─── */}
          {step === 'email' && (
            <form onSubmit={handleSendOtp}>
              <VStack spacing={4}>
                <FormControl isInvalid={!!errors.email}>
                  <FormLabel fontSize="sm" color="gray.600" fontWeight="600">Email</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FiMail} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      type="email"
                      placeholder="Enter your registered email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      borderRadius="10px"
                      bg="white"
                      borderColor="gray.200"
                      _focus={{ borderColor: 'teal.400', boxShadow: '0 0 0 1px #2E9E8E' }}
                      size="lg"
                      fontSize="sm"
                    />
                  </InputGroup>
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>

                <Button
                  type="submit"
                  w="full"
                  size="lg"
                  fontSize="sm"
                  bg="linear-gradient(135deg, #5FAF46 0%, #2E9E8E 50%, #1CA3D6 100%)"
                  color="white"
                  borderRadius="10px"
                  isLoading={loading}
                  _hover={{
                    bg: 'linear-gradient(135deg, #4e9139 0%, #278a7c 50%, #178fbd 100%)',
                    transform: 'translateY(-1px)',
                    boxShadow: 'lg',
                  }}
                  _active={{ transform: 'translateY(0)' }}
                >
                  Send OTP
                </Button>
              </VStack>
            </form>
          )}

          {/* ─── Step 2: OTP ─── */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp}>
              <VStack spacing={6}>
                <FormControl isInvalid={!!errors.otp}>
                  <FormLabel fontSize="sm" color="gray.600" fontWeight="600" textAlign="center">
                    Enter the 6-digit code
                  </FormLabel>
                  <Flex justify="center">
                    <HStack>
                      <PinInput
                        size="lg"
                        otp
                        value={otp}
                        onChange={setOtp}
                        placeholder=""
                      >
                        <PinInputField borderColor="gray.300" _focus={{ borderColor: 'teal.400', boxShadow: '0 0 0 1px #2E9E8E' }} />
                        <PinInputField borderColor="gray.300" _focus={{ borderColor: 'teal.400', boxShadow: '0 0 0 1px #2E9E8E' }} />
                        <PinInputField borderColor="gray.300" _focus={{ borderColor: 'teal.400', boxShadow: '0 0 0 1px #2E9E8E' }} />
                        <PinInputField borderColor="gray.300" _focus={{ borderColor: 'teal.400', boxShadow: '0 0 0 1px #2E9E8E' }} />
                        <PinInputField borderColor="gray.300" _focus={{ borderColor: 'teal.400', boxShadow: '0 0 0 1px #2E9E8E' }} />
                        <PinInputField borderColor="gray.300" _focus={{ borderColor: 'teal.400', boxShadow: '0 0 0 1px #2E9E8E' }} />
                      </PinInput>
                    </HStack>
                  </Flex>
                  <FormErrorMessage justifyContent="center">{errors.otp}</FormErrorMessage>
                </FormControl>

                <Button
                  type="submit"
                  w="full"
                  size="lg"
                  fontSize="sm"
                  bg="linear-gradient(135deg, #5FAF46 0%, #2E9E8E 50%, #1CA3D6 100%)"
                  color="white"
                  borderRadius="10px"
                  isLoading={loading}
                  _hover={{
                    bg: 'linear-gradient(135deg, #4e9139 0%, #278a7c 50%, #178fbd 100%)',
                    transform: 'translateY(-1px)',
                    boxShadow: 'lg',
                  }}
                  _active={{ transform: 'translateY(0)' }}
                >
                  Verify OTP
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  color="teal.500"
                  onClick={handleSendOtp as any}
                  isDisabled={loading}
                >
                  Didn&apos;t receive it? Resend OTP
                </Button>
              </VStack>
            </form>
          )}

          {/* ─── Step 3: New Password ─── */}
          {step === 'password' && (
            <form onSubmit={handleResetPassword}>
              <VStack spacing={4}>
                <FormControl isInvalid={!!errors.newPassword}>
                  <FormLabel fontSize="sm" color="gray.600" fontWeight="600">New Password</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FiLock} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      borderRadius="10px"
                      bg="white"
                      borderColor="gray.200"
                      _focus={{ borderColor: 'teal.400', boxShadow: '0 0 0 1px #2E9E8E' }}
                      size="lg"
                      fontSize="sm"
                    />
                    <InputRightElement h="full">
                      <IconButton
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        icon={<Icon as={showPassword ? FiEyeOff : FiEye} />}
                        variant="ghost"
                        size="sm"
                        color="gray.400"
                        _hover={{ color: 'gray.600' }}
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{errors.newPassword}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.confirmPassword}>
                  <FormLabel fontSize="sm" color="gray.600" fontWeight="600">Confirm Password</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FiLock} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      borderRadius="10px"
                      bg="white"
                      borderColor="gray.200"
                      _focus={{ borderColor: 'teal.400', boxShadow: '0 0 0 1px #2E9E8E' }}
                      size="lg"
                      fontSize="sm"
                    />
                  </InputGroup>
                  <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
                </FormControl>

                <Button
                  type="submit"
                  w="full"
                  size="lg"
                  fontSize="sm"
                  bg="linear-gradient(135deg, #5FAF46 0%, #2E9E8E 50%, #1CA3D6 100%)"
                  color="white"
                  borderRadius="10px"
                  isLoading={loading}
                  _hover={{
                    bg: 'linear-gradient(135deg, #4e9139 0%, #278a7c 50%, #178fbd 100%)',
                    transform: 'translateY(-1px)',
                    boxShadow: 'lg',
                  }}
                  _active={{ transform: 'translateY(0)' }}
                >
                  Reset Password
                </Button>
              </VStack>
            </form>
          )}

          <Text textAlign="center" mt={6} fontSize="xs" color="gray.400">
            {step === 'otp' ? 'Check your spam folder if you don\'t see the email' : 'Contact your administrator if you need further help'}
          </Text>
        </Box>
      </Flex>
    </Flex>
  )
}
