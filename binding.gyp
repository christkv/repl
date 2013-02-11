{
  'targets': [
    {
      'target_name': 'sync',
      'sources': [ 'ext/ext.cc' ],
      'cflags!': [ '-fno-exceptions' ],
      'cflags_cc!': [ '-fno-exceptions' ],
      'conditions': [
        ['OS=="mac"', {
          'xcode_settings': {
            'GCC_ENABLE_CPP_EXCEPTIONS': 'YES'
          }
        }]
      ]
    }
  ]
}
